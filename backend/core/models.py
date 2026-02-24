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