from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_faculty),
    path('login/', views.login_faculty),
    path('subjects/', views.get_subjects_by_filters),
    path('add-co/', views.add_course_outcome),
    path('profile/<int:faculty_id>/', views.get_profile),
    path('update-password/', views.update_password),
]