from django.db import models


class Faculty(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    designation = models.CharField(max_length=100)
    branch = models.CharField(max_length=100, null=True, blank=True)
    password = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.full_name} ({self.designation})"


class Subject(models.Model):
    subject_code = models.CharField(max_length=20)
    subject_name = models.CharField(max_length=100)
    batch = models.CharField(max_length=20)
    session = models.CharField(max_length=20)
    semester = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.subject_code} - {self.subject_name}"


class CourseOutcome(models.Model):
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    co_number = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"CO {self.co_number} - {self.subject.subject_code}"