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
    path('upload-students/', views.upload_students_csv),
    path('get-co-marks/', views.get_co_marks),
    path("branch-semester/", views.get_branch_semester),
    path("download-excel/<str:branch>/<int:semester>/", views.download_excel),
    path('principal/stats/', views.principal_dashboard_stats),
    path('all-students/', views.get_all_students),
    path('export-students/', views.export_students_excel),
    path('all-faculty/', views.get_all_faculty),
path('export-faculty/', views.export_faculty_excel),
path('upload-faculty/', views.upload_faculty_csv),
path('all-subjects/', views.get_all_subjects),
path('export-subjects/', views.export_subjects_excel),
path('get-co-marks/', views.get_co_marks),
path('export-co-marks/', views.export_co_marks_excel),
]