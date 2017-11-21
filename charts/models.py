from django.db import models
from datetime import datetime
import datetime


# Create your models here.
class Patients(models.Model):
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    gender = models.CharField(max_length=10)
    date_of_surgery = models.DateTimeField(default=datetime.datetime(year=1800, month=1, day=1), blank=True)
    icd10procedure = models.CharField(max_length=20)
    city = models.CharField(max_length=200)
    date_of_birth = models.DateTimeField(default=datetime.datetime(year=1800, month=1, day=1), blank=True)
    icd10desc = models.TextField()

    def __str__(self):
        return self.first_name

    class Meta:
        verbose_name_plural = "Patients"
