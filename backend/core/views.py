from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from .models import Faculty, Subject
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