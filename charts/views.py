from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib import messages
from django.urls import reverse
from datetime import datetime
from .models import Patients
from csv import reader
import datetime
import logging
import json
from django.db import connection
from django.db.models import Min, Max
from django.http import JsonResponse


# Create your views here.
def index(request):
    # return HttpResponse('HELLO FROM CHARTS')
    return render(request, 'charts/index.html')


def upload_csv(request):
    data = {}

    if request.method == 'GET':
        return render(request, "charts/index.html", data)

    # if not GET, then proceed
    try:
        csv_file = request.FILES["csv_file"]

        if not csv_file.name.endswith('.csv'):
            messages.error(request, 'File is not CSV type')
            return HttpResponseRedirect(reverse("upload_csv"))
        # if file is too large, return
        if csv_file.multiple_chunks():
            messages.error(request, "Uploaded file is too big (%.2f MB)." % (csv_file.size / (1000 * 1000),))
            return HttpResponseRedirect(reverse("upload_csv"))

        file_data = csv_file.read().decode("utf-8")

        i = 0

        lines = file_data.split("\n")

        for line in reader(lines):

            if i > 0:
                p = Patients(
                    first_name=line[1],
                    last_name=line[2],
                    gender=line[3],
                    date_of_surgery=date_surgery(line[4]),
                    icd10procedure=line[5],
                    city=line[6],
                    date_of_birth=date_birth(line[7]),
                    icd10desc=line[8]
                 )

                p.save()

            i += 1

    except Exception as e:
        logging.getLogger("error_logger").error("Unable to upload file. " + repr(e))
        messages.error(request, "Unable to upload file. " + repr(e))

    content = {
        'line': line,
        'line_len': len(line),
        'patient': p,
    }

    return render(request, "charts/show_charts.html", content)


# format birth date from csv
# mm/dd/yyyy --> yyyy-mm-dd
# if date from csv empty set default value (1800-01-01)
def date_birth(date_birth_from_csv):

    if '/' not in date_birth_from_csv:
        return datetime.datetime(year=1800, month=1, day=1)

    date_info = date_birth_from_csv.split("/")
    date_month =date_info[0]
    date_day = date_info[1]
    date_year = date_info[2]
    return datetime.datetime(year=int(date_year), month=int(date_month), day=int(date_day))


# check surgery date from csv
# if surgery date from csv empty set default value (1800-01-01)
def date_surgery(date_surgery_from_csv):

    if '-' not in date_surgery_from_csv:
        return datetime.datetime(year=1800, month=1, day=1)

    return date_surgery_from_csv

# get data for D3 charts
def charts_data(request):

    p = Patients.objects.all()

    data_ch01 = data_chart_01()
    data_ch02 = data_chart_02(20, 2016, 3, 2017, 8)
    data_ch03 = data_chart_03()
    data_ch04 = data_chart_04()

    min_date = Patients.objects.filter(date_of_surgery__year__gte=1900).aggregate(Min('date_of_surgery'))
    max_date = Patients.objects.all().aggregate(Max('date_of_surgery'))

    content = {
        'data_ch01': json.dumps(data_ch01),
        'data_ch02': json.dumps(data_ch02),
        'data_ch03': json.dumps(data_ch03),
        'data_ch04': json.dumps(data_ch04),
        'date_min': min_date['date_of_surgery__min'],
        'date_max': max_date['date_of_surgery__max'],
        'range_months': range(1, 13),
    }

    return render(request, "charts/show_charts.html", content)


# chart 1 data - number of patients by age range
def data_chart_01():

    p = Patients.objects.all()

    age_range = 5
    age_range_start = 10
    age_range_stop = 80

    data = []
    b = {"X": "1-5", "Y": 10}

    for age in range (age_range_start, age_range_stop, age_range):
        birth_date_start = date_years_ago(age + age_range - 1)
        birth_date_stop = date_years_ago(age)

        p_count = Patients.objects.filter(date_of_birth__range=(birth_date_start, birth_date_stop)).count()

        b["X"] = str(age) + '-' + str(age + age_range - 1)
        b["Y"] = p_count
        data.append(b.copy())

    return data


# count patients by age range for selected months
def data_chart_02(age_range, year_start, month_start, year_end, month_end):
    data = []

    for year in range(year_start, year_end+1, 1):
        month_from = month_start
        month_to = month_end
        if year != year_start:
            month_from = 1
        if year != year_end:
            month_to = 12

        for month in range(month_from, month_to+1, 1):

            patients_list = Patients.objects.filter(date_of_surgery__year=year, date_of_surgery__month=month)

            tmp = {}
            label_x = str(month) + '/' + str(year)
            tmp["X"] = label_x

            age_range_start = 10
            age_range_stop = 80

            for age in range(age_range_start, age_range_stop, age_range):
                birth_date_start = date_years_ago(age + age_range - 1)
                birth_date_stop = date_years_ago(age)

                patients_count = patients_list.filter(date_of_birth__range=(birth_date_start, birth_date_stop)).count()
                key = str(age) + '-' + str(age + age_range - 1)
                tmp[key] = patients_count

            data.append(tmp.copy())

    return data


# count patients by age range for selected months
def data_chart_03():
    data = []

    month_start = 2
    month_end = 11
    year_start = 2016
    year_end = 2017

    for year in range(year_start, year_end+1, 1):
        month_from = month_start
        month_to = month_end
        if year != year_start:
            month_from = 1
        if year != year_end:
            month_to = 12

        for month in range(month_from, month_to+1, 1):

            patients_list = Patients.objects.filter(date_of_surgery__year=year, date_of_surgery__month=month)

            tmp = {}
            label_x = str(month) + '/' + str(year)
            tmp["X"] = label_x

            male_patients_count = patients_list.filter(gender='male').count()
            female_patients_count = patients_list.filter(gender='female').count()

            total = male_patients_count + female_patients_count
            if total > 0:
                tmp["male"] = male_patients_count/total
                tmp["female"] = 1-tmp["male"]
            else:
                tmp["male"] = 0.01
                tmp["female"] = 0.01

            data.append(tmp.copy())
    # end for year

    return data


# draw most common procedures
def data_chart_04():
    data = []

    raw_query = "SELECT "
    raw_query += " substring_index(icd10desc, ' ', 1) as first_word,"
    raw_query += " id, count(id) as total"
    raw_query += " FROM charts_patients"
    raw_query += " WHERE substring_index(icd10desc, ' ', 1)  <> ''"
    raw_query += " GROUP BY first_word ORDER BY count(id) DESC"

    cursor = connection.cursor()
    cursor.execute(raw_query)

    raw_query_result = cursor.fetchall()
    procedures = list(raw_query_result)

    procedures_limit = 10
    if len(procedures) < 10:
        procedures_limit = len(procedures)

    b = {}
    for i in range(0, procedures_limit, 1):
        b["X"] = procedures[i][0]
        b["Y"] = int(procedures[i][2])
        data.append(b.copy())

    return data


def date_years_ago(years, from_date=None):

    if from_date is None:
        from_date = datetime.datetime.today()

    try:
        return from_date.replace(year=from_date.year - years)
    except ValueError:
        # assert from_date.month == 2 and from_date.day == 29
        return from_date.replace(month=2, day=28, year=from_date.year-years)


def chart02_update(request):

    age_range = request.GET.get('age_range', 10)
    year_from = request.GET.get('year_from', 2015)
    month_from = request.GET.get('month_from', 1)
    year_to = request.GET.get('year_to', 2017)
    month_to = request.GET.get('month_to', 12)

    data = data_chart_02(
        int(age_range),
        int(year_from),
        int(month_from),
        int(year_to),
        int(month_to)
    )

    return JsonResponse(data, safe=False)

