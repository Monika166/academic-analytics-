from collections import defaultdict
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from .models import Faculty, Subject, Student, CourseOutcome, COMark
from rest_framework.decorators import api_view
from rest_framework.response import Response
import csv
import io
from .models import CourseOutcome
import openpyxl
from django.http import HttpResponse
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
            final_branch = branch 
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

                        # 🔥 ROLE CHECK LOGIC (FIXED)
            designation = faculty.designation.strip().upper()

            if login_type == "HOD":
                if designation != "HOD":
                    return JsonResponse(
                        {"error": "Access denied. Only HOD can login here."},
                        status=403
                    )

            elif login_type == "PRINCIPAL":
                if designation != "PRINCIPAL":
                    return JsonResponse(
                        {"error": "Access denied. Only Principal can login here."},
                        status=403
                    )

            elif login_type == "FACULTY":
                if designation not in ["PROFESSOR", "HOD"]:
                    return JsonResponse(
                        {"error": "Access denied."},
                        status=403
                    )

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
                registration_number = row.get("registration_number")
                email = row.get("email")

                if not full_name or not registration_number:
                    continue

                if Student.objects.filter(
                    registration_number=registration_number.strip(),
                    batch=batch,
                    session=session,
                    # branch=branch
                ).exists():
                    continue

                Student.objects.create(
                    full_name=full_name.strip(),
                   registration_number=registration_number.strip(),
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
            if not all([session, batch, semester, branch]):
                return JsonResponse({"students": []}, status=200)
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
                    "registration_number": student.registration_number,
                    "email": student.email,         
                    "semester": student.semester,
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
            branch = data.get("branch")
            faculty_id = data.get("faculty_id")
            subject_id = data.get("subject_id")

            # ✅ Basic validation
            if not all([batch, session, semester, faculty_id, subject_id]):
                return JsonResponse(
                    {"error": "All fields are required"},
                    status=400
                )

            # ✅ Safe faculty fetch
            try:
                faculty = Faculty.objects.get(id=faculty_id)
            except Faculty.DoesNotExist:
                return JsonResponse({"error": "Invalid faculty"}, status=400)

            # ✅ Safe subject fetch
            try:
                subject = Subject.objects.get(id=subject_id)
            except Subject.DoesNotExist:
                return JsonResponse({"error": "Invalid subject"}, status=400)

            # ✅ Prevent duplicate CO
            existing_co = CourseOutcome.objects.filter(
                subject=subject,
                batch=batch,
                semester=int(semester),
                session=session
            ).first()

            if existing_co:
                return JsonResponse({
                    "error": "Course Outcome already exists for this subject"
                }, status=400)

            # ✅ Create CO
            co = CourseOutcome.objects.create(
                faculty=faculty,
                subject=subject,
                batch=batch,
                session=session,
                semester=int(semester),
                branch=branch
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
@csrf_exempt
def get_co_marks(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            subject_id = data.get("subject_id")

            # 🔥 Optimize query
            marks = COMark.objects.filter(
                subject_id=subject_id
            ).select_related("student")

            mark_list = []

            for mark in marks:
                mark_list.append({
                    "student_id": mark.student.id,
                    "student_name": mark.student.full_name,   # ✅ THIS
                    "registration_number": mark.student.registration_number, # ✅ THIS
                    "co_number": mark.co_number,
                    "marks": mark.marks,
                    "semester": mark.semester,
                    "branch": mark.branch,
                    "batch": mark.batch,
                    "session": mark.session,
                })

            return JsonResponse({"marks": mark_list}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Only POST allowed"}, status=405)
@csrf_exempt
def get_branch_semester(request):
    faculty_id = request.GET.get("faculty_id")

    if not faculty_id:
        return JsonResponse({"error": "Faculty ID required"}, status=400)

    # ✅ Get COs (already linked to subject)
    course_outcomes = CourseOutcome.objects.filter(faculty_id=faculty_id)

    data = []

    for co in course_outcomes:
        data.append({
            "batch": co.batch,
            "session": co.session,
            "branch": co.branch,
            "semester": co.semester,
            "subject": co.subject.subject_name,   # ✅ correct mapping
            "subject_id": co.subject.id,          # ✅ important
        })

    return JsonResponse(data, safe=False)
def download_excel(request, branch, semester):
    subject_name = request.GET.get("subject")
    marks = COMark.objects.filter(
        branch__iexact=branch,
        semester=semester,
        subject__subject_name=subject_name 
    ).select_related("student", "subject")

    wb = openpyxl.Workbook()
    ws = wb.active

    students = defaultdict(dict)
    co_set = set()

    # Collect marks per student
    for m in marks:
        reg = m.student.registration_number
        co = f"CO{m.co_number}"

        students[reg]["name"] = m.student.full_name
        students[reg]["registration_number"] = reg
        students[reg]["subject"] = m.subject.subject_name
        students[reg][co] = m.marks

        co_set.add(co)

    co_list = sorted(co_set)

    headers = ["Student Name", "Registration Number", "Subject"] + co_list + ["Total"]
    ws.append(headers)

    co_totals = {co: 0 for co in co_list}
    student_count = 0

    # Write student rows
    for student in students.values():

        row = [
            student.get("name"),
            student.get("registration_number"),
            student.get("subject")
        ]

        total = 0

        for co in co_list:
            mark = student.get(co, 0)
            row.append(mark)

            total += mark
            co_totals[co] += mark

        row.append(total)
        ws.append(row)

        student_count += 1

    # Calculate CO averages
    co_avg = {}
    for co in co_list:
        if student_count > 0:
            co_avg[co] = round(co_totals[co] / student_count, 2)
        else:
            co_avg[co] = 0

    # Count students above average
    above_avg = {co: 0 for co in co_list}

    for student in students.values():
        for co in co_list:
            if student.get(co, 0) >= co_avg[co]:
                above_avg[co] += 1

    # Calculate CO attainment levels
    co_attainment = {}

    for co in co_list:
        percentage = (above_avg[co] / student_count) * 100 if student_count else 0

        if percentage >= 70:
            co_attainment[co] = 0.9
        elif percentage >= 60:
            co_attainment[co] = 0.6
        elif percentage >= 50:
            co_attainment[co] = 0.3
        else:
            co_attainment[co] = 0

    ws.append([])

    # Average marks row
    avg_row = ["", "", "Average Marks"]
    for co in co_list:
        avg_row.append(co_avg[co])
    avg_row.append("")
    ws.append(avg_row)

    # Students >= average
    count_row = ["", "", "Students ≥ Avg"]
    for co in co_list:
        count_row.append(above_avg[co])
    count_row.append("")
    ws.append(count_row)

    # CO attainment row
    attain_row = ["", "", "CO Attainment"]
    for co in co_list:
        attain_row.append(co_attainment[co])
    attain_row.append("")
    ws.append(attain_row)

    # Average CO attainment
    avg_attainment = round(sum(co_attainment.values()) / len(co_attainment), 2) if co_attainment else 0

    ws.append([])
    ws.append(["", "", "Average CO Attainment", avg_attainment])

    response = HttpResponse(content_type="application/ms-excel")
    response["Content-Disposition"] = f"attachment; filename={subject_name}_{branch}_sem{semester}.xlsx"

    wb.save(response)

    return response
def principal_dashboard_stats(request):
    data = {
        "students": Student.objects.count(),
        "faculty": Faculty.objects.count(),
        "subjects": Subject.objects.count(),
    }
    return JsonResponse(data)
def get_all_students(request):
    if request.method == "GET":
        students = Student.objects.all()

        student_list = []

        for student in students:
            student_list.append({
                "id": student.id,
                "full_name": student.full_name,
                "registration_number": student.registration_number,
                "email": student.email,
                "branch": student.branch,
                "semester": student.semester,
            })

        return JsonResponse(student_list, safe=False)

    return JsonResponse({"error": "Only GET allowed"}, status=405)
def export_students_excel(request):
    import openpyxl
    from django.http import HttpResponse
    from .models import Student

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Students"

    ws.append(["Name", "Registration No", "Branch", "Semester"])

    branch = request.GET.get("branch")
    semester = request.GET.get("semester")

    students = Student.objects.all()

    if branch:
        students = students.filter(branch__iexact=branch)

    if semester:
        students = students.filter(semester=semester)

    for s in students:
        ws.append([
            s.full_name,
            s.registration_number,
            s.branch,
            s.semester
        ])

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=students.xlsx"

    wb.save(response)
    return response