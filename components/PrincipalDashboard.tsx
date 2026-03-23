import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  User,
  ChevronDown,
  Settings,
  UserCircle,
  HelpCircle,
  LogOut,
} from "lucide-react";

const PrincipalDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [principalName, setPrincipalName] = useState("Principal");
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    subjects: 0,
  });
  const [showStudents, setShowStudents] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const [faculty, setFaculty] = useState<any[]>([]);
  const [showFaculty, setShowFaculty] = useState(false);
  const [selectedFacultyBranch, setSelectedFacultyBranch] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");

  const [coData, setCoData] = useState<any[]>([]);
  const [showCO, setShowCO] = useState(false);

  const [selectedCOBranch, setSelectedCOBranch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [subjects, setSubjects] = useState<any[]>([]);
  const [showSubjects, setShowSubjects] = useState(false);
  const [selectedSubjectBranch, setSelectedSubjectBranch] = useState("");
  const [selectedSubjectSemester, setSelectedSubjectSemester] = useState("");

  const [coaData, setCoaData] = useState<any[]>([]);
  const [showCOA, setShowCOA] = useState(false);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/principal/stats/");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const name = localStorage.getItem("faculty_name");
    if (name) setPrincipalName(name);
  }, []);
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/all-students/");
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/all-faculty/");
        const data = await res.json();
        setFaculty(data);
      } catch (error) {
        console.error("Error fetching faculty:", error);
      }
    };

    fetchFaculty();
  }, []);

  useEffect(() => {
    const fetchCO = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/co-data/");
        const data = await res.json();
        setCoData(data);
      } catch (error) {
        console.error("Error fetching CO:", error);
      }
    };

    fetchCO();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/all-subjects/");
        const data = await res.json();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchCOA = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/coa-data/");
        const data = await res.json();
        setCoaData(data);
      } catch (error) {
        console.error("Error fetching COA:", error);
      }
    };

    fetchCOA();
  }, []);

  const filteredStudents = students.filter((student) => {
    return (
      (selectedBranch === "" || student.branch === selectedBranch) &&
      (selectedSemester === "" ||
        student.semester.toString() === selectedSemester)
    );
  });

  const filteredFaculty = faculty.filter((f) => {
    return (
      (selectedFacultyBranch === "" ||
        f.branch?.toUpperCase() === selectedFacultyBranch) &&
      (selectedDesignation === "" ||
        f.designation?.toUpperCase() === selectedDesignation)
    );
  });

  const filteredCO = coData.filter((c) => {
    return (
      (selectedCOBranch === "" ||
        c.branch?.toUpperCase() === selectedCOBranch) &&
      (selectedSubject === "" || c.subject_code === selectedSubject)
    );
  });

  const filteredSubjects = subjects.filter((s) => {
    return (
      (selectedSubjectBranch === "" ||
        s.branch?.toUpperCase() === selectedSubjectBranch) &&
      (selectedSubjectSemester === "" ||
        s.semester.toString() === selectedSubjectSemester)
    );
  });

  const uniqueBranches = [
    ...new Set(
      students.map((s) => s.branch?.trim().toUpperCase()).filter(Boolean),
    ),
  ];

  const facultyBranches = [
    ...new Set(
      faculty.map((f) => f.branch?.trim().toUpperCase()).filter(Boolean),
    ),
  ];

  // CO FILTER DATA
  const subjectCodes = [
    ...new Map(
      coData.map((c) => [
        c.subject_code,
        `${c.subject_name} (${c.subject_code})`,
      ]),
    ).values(),
  ];
  const coBranches = [
    ...new Set(
      coData.map((c) => c.branch?.trim().toUpperCase()).filter(Boolean),
    ),
  ];

  const subjectBranches = [
    ...new Set(
      subjects.map((s) => s.branch?.trim().toUpperCase()).filter(Boolean),
    ),
  ];

  const handleLogoutConfirm = () => {
    localStorage.clear();
    setIsLogoutModalOpen(false);
    navigate("/principal-login");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ================= NAVBAR ================= */}
      <header className="h-[70px] bg-white border-b border-slate-100 shadow-sm flex items-center relative z-50">
        <div className="max-w-[1200px] w-full mx-auto px-6 flex justify-between items-center">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center shadow-md cursor-pointer"
              onClick={() => navigate("/")}
            >
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-slate-800">
              Academic Analytics
            </span>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            {/* ROLE TEXT */}
            <div className="text-right hidden sm:block">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  PRINCIPAL
                </span>
              </div>
            </div>

            {/* PROFILE BUTTON */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                <User size={20} />
              </div>
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* DROPDOWN */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border py-2">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50"
                >
                  <UserCircle size={18} /> My Profile
                </button>

                <button
                  onClick={() => navigate("/settings")}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50"
                >
                  <Settings size={18} /> Settings
                </button>

                <button
                  onClick={() => navigate("/support")}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50"
                >
                  <HelpCircle size={18} /> Support Center
                </button>

                <div className="h-px bg-slate-200 my-2" />

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 font-semibold"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* ================= DASHBOARD CONTENT ================= */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* WELCOME */}
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Welcome, {principalName}
        </h2>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* STUDENTS */}
          <div
            onClick={() => setShowStudents(!showStudents)}
            className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition"
          >
            <h3 className="text-slate-500 text-sm">Total Students</h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">
              {stats.students}
            </p>
          </div>
          {/* ================= STUDENTS MODAL ================= */}
          {showStudents && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              {/* BACKDROP */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

              {/* MODAL BOX */}
              <div className="relative bg-white w-[90%] max-w-5xl rounded-2xl shadow-xl p-6 z-10">
                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Students List</h3>

                  <button
                    onClick={() => setShowStudents(false)}
                    className="text-red-500 font-bold text-lg"
                  >
                    ✕
                  </button>
                </div>

                {/* FILTERS */}
                <div className="flex gap-4 mb-4">
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="border px-4 py-2 rounded"
                  >
                    <option value="">All Branches</option>

                    {uniqueBranches.map((branch, index) => (
                      <option key={index} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="border px-4 py-2 rounded"
                  >
                    <option value="">All Semesters</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Sem {sem}
                      </option>
                    ))}
                  </select>
                </div>

                {/* TABLE */}
                <div className="bg-white border rounded-lg overflow-x-auto max-h-[400px]">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 text-slate-600 uppercase text-xs sticky top-0">
                      <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Reg No</th>
                        <th className="px-6 py-3">Branch</th>
                        <th className="px-6 py-3">Semester</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                          <tr
                            key={index}
                            className="border-t hover:bg-slate-50"
                          >
                            <td className="px-6 py-3">{student.full_name}</td>
                            <td className="px-6 py-3">
                              {student.registration_number}
                            </td>
                            <td className="px-6 py-3">{student.branch}</td>
                            <td className="px-6 py-3">{student.semester}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-6 text-slate-400"
                          >
                            No students found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* IMPORT BUTTON */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => {
                      const url = `http://127.0.0.1:8000/api/export-students/?branch=${selectedBranch}&semester=${selectedSemester}`;
                      window.open(url, "_blank");
                    }}
                    className="bg-blue-700 text-white px-4 py-2 rounded shadow"
                  >
                    Export Excel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FACULTY */}
          <div
            onClick={() => setShowFaculty(!showFaculty)}
            className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition"
          >
            <h3 className="text-slate-500 text-sm">Total Faculty</h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">
              {stats.faculty}
            </p>
          </div>

          {showFaculty && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

              <div className="relative bg-white w-[90%] max-w-5xl rounded-2xl shadow-xl p-6 z-10">
                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Faculty List</h3>

                  <button
                    onClick={() => setShowFaculty(false)}
                    className="text-red-500 font-bold text-lg"
                  >
                    ✕
                  </button>
                </div>

                {/* FILTER */}
                <div className="flex gap-4 mb-4">
                  {/* BRANCH */}
                  <select
                    value={selectedFacultyBranch}
                    onChange={(e) => setSelectedFacultyBranch(e.target.value)}
                    className="border px-4 py-2 rounded"
                  >
                    <option value="">All Branches</option>

                    {facultyBranches.map((branch, index) => (
                      <option key={index} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>

                  {/* DESIGNATION */}
                  <select
                    value={selectedDesignation}
                    onChange={(e) => setSelectedDesignation(e.target.value)}
                    className="border px-4 py-2 rounded"
                  >
                    <option value="">All Designations</option>
                    <option value="HOD">HOD</option>
                    <option value="FACULTY">Faculty</option>
                  </select>
                </div>

                {/* TABLE */}
                <div className="bg-white border rounded-lg overflow-x-auto max-h-[400px]">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 text-slate-600 uppercase text-xs sticky top-0">
                      <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Designation</th>
                        <th className="px-6 py-3">Branch</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredFaculty.length > 0 ? (
                        filteredFaculty.map((f, index) => (
                          <tr
                            key={index}
                            className="border-t hover:bg-slate-50"
                          >
                            <td className="px-6 py-3">{f.full_name}</td>
                            <td className="px-6 py-3">{f.email}</td>
                            <td className="px-6 py-3">{f.designation}</td>
                            <td className="px-6 py-3">{f.branch}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-6 text-slate-400"
                          >
                            No faculty found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* EXPORT */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => {
                      const url = `http://127.0.0.1:8000/api/export-faculty/?branch=${selectedFacultyBranch}`;
                      window.open(url, "_blank");
                    }}
                    className="bg-blue-700 text-white px-4 py-2 rounded shadow"
                  >
                    Export Excel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUBJECTS */}
          <div
            onClick={() => setShowSubjects(!showSubjects)}
            className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition"
          >
            <h3 className="text-slate-500 text-sm">Total Subjects</h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">
              {stats.subjects}
            </p>
          </div>
          {/* CO */}
          <div
            onClick={() => setShowCO(!showCO)}
            className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition"
          >
            <h3 className="text-slate-500 text-sm">CO Analytics</h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">View</p>
          </div>
          {/* COA */}
          <div
            onClick={() => setShowCOA(true)}
            className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition"
          >
            <h3 className="text-slate-500 text-sm">Course Attainment</h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">View</p>
          </div>
        </div>
      </div>

      {showSubjects && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          <div className="relative bg-white w-[90%] max-w-5xl rounded-2xl shadow-xl p-6 z-10">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Subjects List</h3>

              <button
                onClick={() => setShowSubjects(false)}
                className="text-red-500 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* FILTER */}
            <div className="flex gap-4 mb-4">
              {/* BRANCH */}
              <select
                value={selectedSubjectBranch}
                onChange={(e) => setSelectedSubjectBranch(e.target.value)}
                className="border px-4 py-2 rounded"
              >
                <option value="">All Branches</option>

                {subjectBranches.map((branch, index) => (
                  <option key={index} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>

              {/* SEMESTER */}
              <select
                value={selectedSubjectSemester}
                onChange={(e) => setSelectedSubjectSemester(e.target.value)}
                className="border px-4 py-2 rounded"
              >
                <option value="">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Sem {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* TABLE */}
            <div className="bg-white border rounded-lg overflow-x-auto max-h-[400px]">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-600 uppercase text-xs sticky top-0">
                  <tr>
                    <th className="px-6 py-3">Code</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Branch</th>
                    <th className="px-6 py-3">Semester</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((s, index) => (
                      <tr key={index} className="border-t hover:bg-slate-50">
                        <td className="px-6 py-3">{s.subject_code}</td>
                        <td className="px-6 py-3">{s.subject_name}</td>
                        <td className="px-6 py-3">{s.branch}</td>
                        <td className="px-6 py-3">{s.semester}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-6 text-slate-400"
                      >
                        No subjects found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* EXPORT */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  const url = `http://127.0.0.1:8000/api/export-subjects/?branch=${selectedSubjectBranch}&semester=${selectedSubjectSemester}`;
                  window.open(url, "_blank");
                }}
                className="bg-blue-700 text-white px-4 py-2 rounded shadow"
              >
                Export Excel
              </button>
            </div>
          </div>
        </div>
      )}

      {showCO && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          <div className="relative bg-white w-[90%] max-w-5xl rounded-2xl shadow-xl p-6 z-10">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">CO Analytics</h3>

              <button
                onClick={() => setShowCO(false)}
                className="text-red-500 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* FILTERS */}
            <div className="flex gap-4 mb-4">
              {/* BRANCH */}
              <select
                value={selectedCOBranch}
                onChange={(e) => setSelectedCOBranch(e.target.value)}
                className="border px-4 py-2 rounded"
              >
                <option value="">All Branches</option>

                {coBranches.map((b, i) => (
                  <option key={i} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              {/* SUBJECT */}
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="border px-4 py-2 rounded"
              >
                <option value="">All Subjects</option>

                {[
                  ...new Map(
                    coData.map((c) => [
                      c.subject_code,
                      `${c.subject_name} (${c.subject_code})`,
                    ]),
                  ).values(),
                ].map((subject, i) => (
                  <option key={i} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* TABLE */}
            <div className="bg-white border rounded-lg overflow-x-auto max-h-[400px]">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-600 uppercase text-xs sticky top-0">
                  <tr>
                    <th className="px-6 py-3">Student Name</th>
                    <th className="px-6 py-3">Reg No</th>
                    <th className="px-6 py-3">Subject Code</th>
                    <th className="px-6 py-3">CO Score</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCO.length > 0 ? (
                    filteredCO.map((c, index) => (
                      <tr key={index} className="border-t hover:bg-slate-50">
                        <td className="px-6 py-3">{c.student_name}</td>
                        <td className="px-6 py-3">{c.registration_number}</td>
                        <td className="px-6 py-3">{c.subject_code}</td>
                        <td className="px-6 py-3">{c.co_score}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-6 text-slate-400"
                      >
                        No CO data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* EXPORT */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  const url = `http://127.0.0.1:8000/api/export-co/?branch=${selectedCOBranch}&subject=${selectedSubject}`;
                  window.open(url, "_blank");
                }}
                className="bg-blue-700 text-white px-4 py-2 rounded shadow"
              >
                Export Excel
              </button>
            </div>
          </div>
        </div>
      )}

      {showCOA && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          <div className="relative bg-white w-[90%] max-w-5xl rounded-2xl shadow-xl p-6 z-10">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Course Attainment (COA)</h3>

              <button
                onClick={() => setShowCOA(false)}
                className="text-red-500 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* TABLE */}
            <div className="bg-white border rounded-lg overflow-x-auto max-h-[400px]">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-600 uppercase text-xs sticky top-0">
                  <tr>
                    <th className="px-6 py-3">Branch</th>
                    <th className="px-6 py-3">Subject</th>
                    <th className="px-6 py-3">Semester</th>
                    <th className="px-6 py-3">Course Attainment</th>
                  </tr>
                </thead>

                <tbody>
                  {coaData.length > 0 ? (
                    coaData.map((c, index) => (
                      <tr key={index} className="border-t hover:bg-slate-50">
                        <td className="px-6 py-3">{c.branch}</td>
                        <td className="px-6 py-3">
                          {c.subject_name} ({c.subject_code})
                        </td>
                        <td className="px-6 py-3">{c.semester}</td>
                        <td className="px-6 py-3 font-semibold text-blue-700">
                          {c.coa_value}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-6 text-slate-400"
                      >
                        No COA data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* EXPORT */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  window.open(
                    "http://127.0.0.1:8000/api/export-coa/",
                    "_blank",
                  );
                }}
                className="bg-blue-700 text-white px-4 py-2 rounded shadow"
              >
                Export Excel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= LOGOUT MODAL ================= */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="bg-white p-6 rounded-xl z-10 text-center">
            <h3 className="font-bold mb-4">Confirm Logout</h3>

            <div className="flex gap-3">
              <button
                onClick={handleLogoutConfirm}
                className="bg-blue-700 text-white px-4 py-2 rounded"
              >
                Logout
              </button>

              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalDashboard;
