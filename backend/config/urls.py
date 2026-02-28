from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse


def home(request):
    return HttpResponse("Backend is running successfully!")


urlpatterns = [
    path('', home),                     # http://127.0.0.1:8000/
    path('admin/', admin.site.urls),    # admin panel
    path('api/', include('core.urls')), # your app routes
]