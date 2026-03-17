from django.contrib import admin
from .models import Faculty,Subject,Student,CourseOutcome

admin.site.register(Faculty)
admin.site.register(Subject)
admin.site.register(Student)
admin.site.register(CourseOutcome)