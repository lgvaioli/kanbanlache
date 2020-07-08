from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import TemplateView
       
from . import views
       
urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    path('board/', include('board.urls')),
    path('', views.index),
]
