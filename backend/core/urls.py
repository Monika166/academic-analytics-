from django.urls import path
from . import views
from .views import upload_students_csv


urlpatterns = [
    # Auth
    path('register/', views.register_faculty),
    path('login/', views.login_faculty),

    # Subjects
    path('add-subject/', views.add_subject),
    path('get-hod-subjects/', views.get_hod_subjects),
    path("update-subject/<int:subject_id>/", views.update_subject),

    path("upload-students/", upload_students_csv),
    path("get-students/", views.get_students),
    path("ping/", views.register_faculty),

]