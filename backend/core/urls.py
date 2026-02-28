from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_faculty),
    path('login/', views.login_faculty),
    path('add-co/', views.add_course_outcome),
    path('add-subject/', views.add_subject),
    path('get-hod-subjects/', views.get_hod_subjects),
    path('update-subject/<int:subject_id>/', views.update_subject),
    path('get-subjects-for-co/', views.get_subjects_for_co),
    path('save-co-marks/', views.save_co_marks),
    path('get-students/', views.get_students),
]