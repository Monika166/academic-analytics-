from django.db import models

class Faculty(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    designation = models.CharField(max_length=100)
    # Added branch field: null=True allows this to be empty for non-HOD faculty
    branch = models.CharField(max_length=100, null=True, blank=True)
    password = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.full_name} ({self.designation})"
class Subject(models.Model):
    subject_code = models.CharField(max_length=20)
    subject_name = models.CharField(max_length=200)
    semester = models.IntegerField()
    branch = models.CharField(max_length=100)
    session = models.CharField(max_length=20)
    batch = models.CharField(max_length=20)

    created_by = models.ForeignKey(
        Faculty,
        on_delete=models.CASCADE,
        related_name="created_subjects"
    )

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.subject_code} - {self.subject_name}"
    
class Student(models.Model):
    full_name = models.CharField(max_length=200)
    roll_number = models.CharField(max_length=50)
    email = models.EmailField(blank=True, null=True)

    branch = models.CharField(max_length=100)
    batch = models.CharField(max_length=20)
    semester = models.IntegerField()
    session = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('roll_number', 'batch', 'session')
    def __str__(self):
        return f"{self.full_name} - {self.roll_number}"