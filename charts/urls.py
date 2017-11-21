from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^upload$', views.upload_csv, name='upload_csv'),
    url(r'^show_charts$', views.charts_data, name='charts_data'),
    url(r'^ajax/chart02_update/$', views.chart02_update, name='chart02_update'),
]
