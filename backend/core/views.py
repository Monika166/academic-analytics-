from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from .models import Faculty, Subject, Student, CourseOutcome, COMark
from rest_framework.decorators import api_view
from rest_framework.response import Response
import csv
import io


import json

@csrf_exempt
def register_faculty(request):
    if request.method == "POST":
        try:
            if not request.body:
                return JsonResponse({"error": "Empty request body"}, status=400)

            data = json.loads(request.body)

            full_name = data.get("full_name")
            email = data.get("email")
            phone = data.get("phone")
            designation = data.get("designation")
            # Capture the branch from the request
            branch = data.get("branch")
            password = data.get("password")

            # Check missing fields (branch is optional for non-HODs, so not in 'all')
            if not all([full_name, email, phone, designation, password]):
                return JsonResponse({"error": "All fields are required"}, status=400)

            # Check duplicate email
            if Faculty.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already registered"}, status=400)

            # Logic to ensure branch is only saved if designation is HOD
            # This matches your frontend's .toUpperCase() logic
            final_branch = branch if designation.strip().upper() == "HOD" else None

            # Create user with the new branch field
            faculty = Faculty.objects.create(
                full_name=full_name,
                email=email,
                phone=phone,
                designation=designation,
                branch=final_branch,
                password=make_password(password)
            )

            # Return the branch in the response so frontend can save it immediately
            return JsonResponse({
                "message": "Registration successful",
                "id": faculty.id,
                "full_name": faculty.full_name,
                "designation": faculty.designation,
                "branch": faculty.branch,
                "email": faculty.email,
                "phone": faculty.phone
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt
def login_faculty(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            email = data.get("email")
            password = data.get("password")
            login_type = data.get("login_type")  # HOD or FACULTY

            if not email or not password or not login_type:
                return JsonResponse(
                    {"error": "Email, password and login type are required"},
                    status=400
                )

            try:
                faculty = Faculty.objects.get(email=email)
            except Faculty.DoesNotExist:
                return JsonResponse({"error": "User not registered"}, status=400)

            # Check password
            if not check_password(password, faculty.password):
                return JsonResponse({"error": "Invalid password"}, status=400)

            # 🔥 ROLE CHECK LOGIC

            # If trying to login from HOD page
            if login_type == "HOD":
                if faculty.designation.strip().upper() != "HOD":
                    return JsonResponse(
                        {"error": "Access denied. Only HOD can login here."},
                        status=403
                    )

            # If trying to login from FACULTY page
            if login_type == "FACULTY":
                # Faculty and HOD both allowed
                pass

            return JsonResponse({
                "message": "Login successful",
                "faculty_id": faculty.id,
                "faculty_name": faculty.full_name,
                "faculty_designation": faculty.designation,
                "faculty_branch": faculty.branch,
                "email": faculty.email,
                "phone": faculty.phone
            }, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)
@csrf_exempt
def add_subject(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            faculty_id = data.get("faculty_id")
            subject_code = data.get("subject_code")
            subject_name = data.get("subject_name")
            semester = data.get("semester")
            branch = data.get("branch")
            session = data.get("session")
            batch = data.get("batch")

            faculty = Faculty.objects.get(id=faculty_id)

            if faculty.designation.strip().upper() != "HOD":
                return JsonResponse(
                    {"error": "Only HOD can add subjects"},
                    status=403
                )

            subject = Subject.objects.create(
                subject_code=subject_code,
                subject_name=subject_name,
                semester=semester,
                branch=branch,
                session=session,
                batch=batch,
                created_by=faculty
            )

            return JsonResponse({"message": "Subject added"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)
@csrf_exempt
def get_hod_subjects(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            faculty_id = data.get("faculty_id")

            faculty = Faculty.objects.get(id=faculty_id)

            subjects = Subject.objects.filter(created_by=faculty)

            subject_list = []

            for subject in subjects:
                subject_list.append({
                    "id": subject.id,
                    "subject_code": subject.subject_code,
                    "subject_name": subject.subject_name,
                    "semester": subject.semester,
                    "branch": subject.branch,
                    "session": subject.session,
                    "batch": subject.batch,
                    "is_active": subject.is_active,
                })

            return JsonResponse({"subjects": subject_list}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)
@csrf_exempt
def update_subject(request, subject_id):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)

            faculty_id = data.get("faculty_id")

            faculty = Faculty.objects.get(id=faculty_id)

            if faculty.designation.strip().upper() != "HOD":
                return JsonResponse(
                    {"error": "Only HOD can edit subjects"},
                    status=403
                )

            subject = Subject.objects.get(id=subject_id)

            subject.subject_code = data.get("subject_code", subject.subject_code)
            subject.subject_name = data.get("subject_name", subject.subject_name)
            subject.semester = data.get("semester", subject.semester)
            subject.session = data.get("session", subject.session)
            subject.batch = data.get("batch", subject.batch)
            subject.is_active = data.get("is_active", subject.is_active)

            subject.save()

            return JsonResponse({"message": "Subject updated"}, status=200)

        except Subject.DoesNotExist:
            return JsonResponse({"error": "Subject not found"}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)
@csrf_exempt
def upload_students_csv(request):
    if request.method == "POST":
        try:
            session = request.POST.get("session")
            batch = request.POST.get("batch")
            semester = int(request.POST.get("semester"))
            branch = request.POST.get("branch")

            csv_file = request.FILES.get("file")

            if not csv_file:
                return JsonResponse({"error": "No file uploaded"}, status=400)

            decoded_file = csv_file.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string)

            students_created = 0

            for row in reader:
                full_name = row.get("full_name")
                roll_number = row.get("roll_number")
                email = row.get("email")

                if not full_name or not roll_number:
                    continue

                if Student.objects.filter(
                    roll_number=roll_number.strip(),
                    batch=batch,
                    session=session
                ).exists():
                    continue

                Student.objects.create(
                    full_name=full_name.strip(),
                    roll_number=roll_number.strip(),
                    email=email.strip() if email else None,
                    branch=branch,
                    batch=batch,
                    semester=semester,
                    session=session
                )

                students_created += 1

            return JsonResponse({
                "message": f"{students_created} students uploaded successfully"
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Only POST allowed"}, status=405)
@csrf_exempt
def get_students(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            session = data.get("session")
            batch = data.get("batch")
            semester = data.get("semester")
            branch = data.get("branch")

            students = Student.objects.filter(
                session=session,
                batch=batch,
                semester=int(semester),
                branch__iexact=branch
            )

            student_list = []

            for student in students:
                student_list.append({
                    "id": student.id,
                    "full_name": student.full_name,
                    "roll_number": student.roll_number,
                })

            return JsonResponse({"students": student_list}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Only POST allowed"}, status=405)

@csrf_exempt
def add_course_outcome(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            batch = data.get("batch")
            session = data.get("session")
            semester = data.get("semester")

            if not batch or not session or not semester:
                return JsonResponse(
                    {"error": "All fields are required"},
                    status=400
                )

            co = CourseOutcome.objects.create(
                batch=batch,
                session=session,
                semester=int(semester)
            )

            return JsonResponse({
                "message": "Course Outcome added successfully",
                "id": co.id
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)
@csrf_exempt
def get_subjects_for_co(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            branch = data.get("branch")
            semester = data.get("semester")
            batch = data.get("batch")
            session = data.get("session")

            # Safety check
            if not all([branch, semester, batch, session]):
                return JsonResponse({"subjects": []}, status=200)

            # 🔥 IMPORTANT FIX: convert semester to int
            semester = int(semester)

            subjects = Subject.objects.filter(
    branch__iexact=branch,
    semester=semester,
    batch__iexact=batch,
    session__iexact=session,
    is_active=True
)

            subject_list = []

            for subject in subjects:
                subject_list.append({
                    "id": subject.id,
                    "subject_code": subject.subject_code,
                    "subject_name": subject.subject_name,
                })

            return JsonResponse({"subjects": subject_list}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)

@api_view(['POST'])
def save_co_marks(request):
    try:
        marks_data = request.data.get("marks")
        subject_id = request.data.get("subject_id")

        subject = Subject.objects.get(id=subject_id)

        for student_id, co_values in marks_data.items():
            student = Student.objects.get(id=int(student_id))

            for co_key, mark in co_values.items():
                # Extract number from "CO1", "CO2"
                co_number = int(co_key.replace("CO", ""))

                COMark.objects.create(
                    student=student,
                    subject=subject,
                    co_number=co_number,
                    marks=float(mark),
                    branch=request.data.get("branch"),
                    batch=request.data.get("batch"),
                    semester=int(request.data.get("semester")),
                    session=request.data.get("session"),
                )

        return Response({"message": "Saved successfully"})

    except Exception as e:
        print("SAVE ERROR:", e)  # 👈 helps debugging
        return Response({"error": str(e)}, status=500)