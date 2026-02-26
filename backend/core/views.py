from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from .models import Faculty
from .models import Subject
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
def get_subjects_by_filters(request):
    if request.method == "GET":
        try:
            batch = request.GET.get("batch")
            session = request.GET.get("session")
            semester = request.GET.get("semester")

            subjects = Subject.objects.filter(
                batch=batch,
                session=session,
                semester=semester
            )

            data = []
            for subject in subjects:
                data.append({
                    "id": subject.id,
                    "subject_code": subject.subject_code,
                    "subject_name": subject.subject_name
                })

            return JsonResponse(data, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)
from .models import CourseOutcome, Subject

@csrf_exempt
def add_course_outcome(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            faculty_id = data.get("faculty_id")
            subject_id = data.get("subject_id")
            number_of_co = data.get("numberOfCO")

            if not all([faculty_id, subject_id, number_of_co]):
                return JsonResponse({"error": "All fields required"}, status=400)

            # Create CO
            co = CourseOutcome.objects.create(
                faculty_id=faculty_id,
                subject_id=subject_id,
                co_number=number_of_co
            )

            return JsonResponse({
                "message": "Course Outcome created successfully"
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)
from django.views.decorators.http import require_http_methods

@csrf_exempt
@require_http_methods(["GET"])
def get_profile(request, faculty_id):
    try:
        faculty = Faculty.objects.get(id=faculty_id)

        return JsonResponse({
            "full_name": faculty.full_name,
            "email": faculty.email,
            "phone": faculty.phone,
            "designation": faculty.designation,
        })

    except Faculty.DoesNotExist:
        return JsonResponse({"error": "Faculty not found"}, status=404)

@csrf_exempt
@require_http_methods(["POST"])
def update_password(request):
    try:
        data = json.loads(request.body)

        faculty_id = data.get("faculty_id")
        current_password = data.get("current_password")
        new_password = data.get("new_password")

        if not all([faculty_id, current_password, new_password]):
            return JsonResponse({"error": "All fields required"}, status=400)

        faculty = Faculty.objects.get(id=faculty_id)

        if not check_password(current_password, faculty.password):
            return JsonResponse({"error": "Current password incorrect"}, status=400)

        faculty.password = make_password(new_password)
        faculty.save()

        return JsonResponse({"message": "Password updated successfully"})

    except Faculty.DoesNotExist:
        return JsonResponse({"error": "Faculty not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)