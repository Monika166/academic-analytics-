import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  GraduationCap,
  User,
  ChevronDown,
  Settings,
  UserCircle,
  HelpCircle,
  LogOut,
} from "lucide-react";

type COAType = {
  branch: string;
  subject: string;
  semester: number;
  attainment: number;
  level: number;
};
const PrincipalDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isAlreadySet, setIsAlreadySet] = useState(false);
  const [savedData, setSavedData] = useState<any>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [showPOPSOModal, setShowPOPSOModal] = useState(false);
  const [poList, setPOList] = useState([]);
  const [psoList, setPSOList] = useState([]);
  const [hodName, setHodName] = useState("");
  const [psoSessions, setPsoSessions] = useState<string[]>([]);
  const [psoBranches, setPsoBranches] = useState<string[]>([]);
  const [psoSession, setPsoSession] = useState("");
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [mappingData, setMappingData] = useState<any[]>([]);
  const [mappingSubject, setMappingSubject] = useState("");
  const [mappingSubjects, setMappingSubjects] = useState<any[]>([]);

  const handleSaveAttainment = async () => {
    if (!selectedSession || !level1 || !level2 || !level3) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/save-attainment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: selectedSession,
          level1: Number(level1),
          level2: Number(level2),
          level3: Number(level3),
        }),
      });

      const data = await res.json();
      console.log("API RESPONSE:", data);

      if (!res.ok) {
        alert(data.error || "Error saving");
        return;
      }

      alert("Attainment levels saved successfully!");
      setIsAlreadySet(true);
      setSavedData({
        level1,
        level2,
        level3,
      });
      setIsModifyMode(false);
      setShowSaved(false);
      // reset
      setLevel1("");
      setLevel2("");
      setLevel3("");
      setShowAttainment(false);
      await fetchCOAData(); //  IMPORTANT
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };
  const [level1, setLevel1] = useState("");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [coAnalyticsData, setCoAnalyticsData] = useState<any[]>([]);
  const [coColumns, setCoColumns] = useState<string[]>([]);

  const [principalName, setPrincipalName] = useState("Principal");
  const [students, setStudents] = useState<any[]>([]);
  const [showAttainment, setShowAttainment] = useState(false);
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
  const [selectedSubjectFaculty, setSelectedSubjectFaculty] = useState("");

  const [coData, setCoData] = useState<any[]>([]);
  const [showCO, setShowCO] = useState(false);

  const [selectedCOBranch, setSelectedCOBranch] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [sessions, setSessions] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [showSubjects, setShowSubjects] = useState(false);
  const [selectedSubjectBranch, setSelectedSubjectBranch] = useState("");
  const [selectedSubjectSemester, setSelectedSubjectSemester] = useState("");
  const [showCODetails, setShowCODetails] = useState(false);
  const [coaData, setCoaData] = useState<COAType[]>([]);
  const [showCOA, setShowCOA] = useState(false);

  const fetchCOAData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/course-attainment/");
      const data = await res.json();
      console.log("REFRESHED DATA:", data);
      setCoaData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching COA:", error);
    }
  };
  // CO DETAILS MODAL STATES
  const [coSubject, setCoSubject] = useState("");
  const [coSubjects, setCoSubjects] = useState<any[]>([]);
  const fetchCOAnalytics = async () => {
    if (!selectedCOBranch || !selectedSubjectId) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/co-analytics/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch: selectedCOBranch,
          subject_id: selectedSubjectId,
        }),
      });

      const data = await res.json();

      setCoAnalyticsData(data.data);
      setCoColumns(data.co_list);
    } catch (err) {
      console.error(err);
    }
  };
  //const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState<COAType[]>([]);
  // CO DETAILS FILTER
  const [coBranch, setCoBranch] = useState("");
  const [coSemester, setCoSemester] = useState("");

  // COA FILTER (keep your existing one)
  const [branch, setBranch] = useState("");
  const [psoBranch, setPsoBranch] = useState("");
  const [semester, setSemester] = useState("");

  useEffect(() => {
    const fetchCO = async () => {
      if (!coBranch || !coSemester || !coSubject) return;

      const res = await fetch(
        `http://127.0.0.1:8000/api/principal-co/?branch=${coBranch}&semester=${coSemester}&subject_id=${coSubject}`,
      );
      const data = await res.json();
      setCoData(data);
    };

    fetchCO();
  }, [coBranch, coSemester, coSubject]);
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const sessionRes = await fetch(
          "http://127.0.0.1:8000/api/get-po-pso-sessions/",
        );
        const sessionsData = await sessionRes.json();
        setPsoSessions(sessionsData);

        const branchRes = await fetch(
          "http://127.0.0.1:8000/api/get-branches/",
        );
        const branchData = await branchRes.json();
        setPsoBranches(branchData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    if (!selectedSession) return;

    const fetchAttainment = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/get-attainment/?session=${selectedSession}`,
        );

        const data = await res.json();

        if (
          data &&
          data.level1 !== undefined &&
          data.level2 !== undefined &&
          data.level3 !== undefined
        ) {
          setIsAlreadySet(true);
          setSavedData(data);

          //  ADD THESE 3 LINES (VERY IMPORTANT)
          setLevel1(data.level1);
          setLevel2(data.level2);
          setLevel3(data.level3);
        } else {
          setIsAlreadySet(false);
          setSavedData(null);

          //  ALSO CLEAR INPUTS FOR NEW SESSION
          setLevel1("");
          setLevel2("");
          setLevel3("");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchAttainment();
  }, [selectedSession]);

  useEffect(() => {
    let filtered = coaData;

    if (branch) {
      filtered = filtered.filter(
        (item) =>
          item.branch?.toUpperCase().trim() === branch.toUpperCase().trim(),
      );
    }

    if (semester) {
      filtered = filtered.filter(
        (item) => item.semester.toString() === semester,
      );
    }

    setFilteredData(filtered);
  }, [branch, semester, coaData]);

  useEffect(() => {
    fetchCOAnalytics();
  }, [selectedSubjectId]);

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
    const fetchSessions = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/sessions/");
        const data = await res.json();
        setSessions(data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    };

    fetchSessions();
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
      if (!coBranch || !coSemester) return;

      const res = await fetch(
        `http://127.0.0.1:8000/api/principal-co/?branch=${coBranch}&semester=${coSemester}`,
      );
      const data = await res.json();
      setCoData(data);
    };

    fetchCO();
  }, [coBranch, coSemester]);

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
    fetchCOAData();
  }, []);
  const fetchPOPSOData = async () => {
    if (!psoSession || !psoBranch) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/get-po-pso/?session=${psoSession}&branch=${psoBranch}`,
      );

      const data = await res.json();

      setPOList(data.pos);
      setPSOList(data.psos);
      setHodName(data.hod_name || "");
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchPOPSOData();
  }, [psoSession, psoBranch]);
  const filteredStudents = students.filter((student) => {
    return (
      (selectedBranch === "" || student.branch === selectedBranch) &&
      (selectedSemester === "" ||
        student.semester.toString() === selectedSemester)
    );
  });
  const fetchMappingData = async () => {
    if (!psoSession || !psoBranch) return;

    try {
      if (!psoSession || !psoBranch || !mappingSubject) return;

      const res = await fetch(
        `http://127.0.0.1:8000/api/get-mapping-principal/?session=${psoSession}&branch=${psoBranch}&subject_id=${mappingSubject}`,
      );

      const data = await res.json();
      setMappingData(data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchMappingSubjects = async () => {
    if (!psoBranch || !psoSession) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/all-subjects/`);

      const data = await res.json();

      // FILTER SUBJECTS
      const filtered = data.filter(
        (s: any) => s.branch === psoBranch && s.session === psoSession,
      );

      setMappingSubjects(filtered);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchMappingSubjects();
  }, [psoBranch, psoSession]);
  useEffect(() => {
    fetchMappingData();
  }, [psoSession, psoBranch, mappingSubject]);

  const filteredFaculty = faculty.filter((f) => {
    return (
      (selectedFacultyBranch === "" ||
        f.branch?.toUpperCase().trim() === selectedFacultyBranch) &&
      (selectedDesignation === "" ||
        f.designation?.toUpperCase().trim() === selectedDesignation)
    );
  });

  const filteredCO = coData.filter((c) => {
    return (
      (selectedCOBranch === "" ||
        c.branch?.toUpperCase() === selectedCOBranch) &&
      (selectedSubjectId === "" || c.subject_id == selectedSubjectId)
    );
  });

  const filteredSubjects = subjects.filter((s) => {
    return (
      (selectedSubjectBranch === "" ||
        s.branch?.toUpperCase() === selectedSubjectBranch) &&
      (selectedSubjectSemester === "" ||
        s.semester.toString() === selectedSubjectSemester) &&
      (selectedSubjectFaculty === "" ||
        s.faculty_name === selectedSubjectFaculty)
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
      students.map((s) => s.branch?.trim().toUpperCase()).filter(Boolean),
    ),
  ];

  const subjectBranches = [
    ...new Set(
      subjects.map((s) => s.branch?.trim().toUpperCase()).filter(Boolean),
    ),
  ];
  const subjectFacultyList = [
    ...new Set(subjects.map((s) => s.faculty_name?.trim()).filter(Boolean)),
  ];
  const handleLogoutConfirm = () => {
    localStorage.clear();
    setIsLogoutModalOpen(false);
    navigate("/principal-login");
  };
  const coAverages: Record<string, number> = {};
  const coAboveAvg: Record<string, number> = {};

  if (coAnalyticsData.length > 0) {
    coColumns.forEach((co) => {
      const total = coAnalyticsData.reduce(
        (sum, row) => sum + (row[co] || 0),
        0,
      );

      coAverages[co] = Number((total / coAnalyticsData.length).toFixed(2));
    });

    coColumns.forEach((co) => {
      const count = coAnalyticsData.filter(
        (row) => (row[co] || 0) >= coAverages[co],
      ).length;

      coAboveAvg[co] = count;
    });
  }

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
                className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""
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
                      if (filteredStudents.length === 0) {
                        alert("No students to export");
                        return;
                      }

                      const headers = [
                        "Name",
                        "Registration No",
                        "Branch",
                        "Semester",
                      ];

                      const rows = filteredStudents.map((s) => [
                        s.full_name,
                        s.registration_number,
                        s.branch,
                        s.semester,
                      ]);

                      const csvContent = [headers, ...rows]
                        .map((row) => row.join(","))
                        .join("\n");

                      const blob = new Blob([csvContent], { type: "text/csv" });
                      const url = window.URL.createObjectURL(blob);

                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "Students_List.csv";
                      a.click();
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
                    <option value="PROFESSOR">Professor</option>
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
          {/*CO Details*/}
          <div
            onClick={() => setShowCODetails(!showCODetails)}
            className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition"
          >
            <h3 className="text-slate-500 text-sm">CO Details</h3>
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
          {/* ATTAINMENT LEVEL */}
          <div
            onClick={() => setShowAttainment(true)}
            className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition"
          >
            <h3 className="text-slate-500 text-sm">Attainment Level</h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">Set</p>
          </div>
          {/* PO PSO details */}
          <div
            onClick={() => setShowPOPSOModal(true)}
            className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition"
          >
            <h3 className="text-slate-500 text-sm">PO & PSO</h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">View</p>
          </div>
          {/*CO-PO-PSO Mapping*/}
          <div
            onClick={() => setShowMappingModal(true)}
            className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition"
          >
            <h3 className="text-slate-500 text-sm">CO-PO-PSO Mapping</h3>
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
            <div className="flex gap-4 mb-4 flex-wrap">
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
              {/* FACULTY */}
              <select
                value={selectedSubjectFaculty}
                onChange={(e) => setSelectedSubjectFaculty(e.target.value)}
                className="border px-4 py-2 rounded"
              >
                <option value="">All Faculty</option>

                {subjectFacultyList.map((f, index) => (
                  <option key={index} value={f}>
                    {f}
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
      {/* CO DETAILS */}
      {showCODetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* BACKDROP */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          {/* MODAL */}
          <div className="relative bg-white w-[90%] max-w-5xl rounded-2xl shadow-xl p-6 z-10">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">CO Details</h3>

              <button
                onClick={() => setShowCODetails(false)}
                className="text-red-500 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* FILTERS */}
            <div className="flex gap-4 mb-4">
              {/* BRANCH */}
              <select
                value={coBranch}
                onChange={(e) => {
                  setCoBranch(e.target.value); // 
                }}
                className="border px-4 py-2 rounded"
              >
                <option value="">Select Branch</option>
                {[...new Set(subjects.map((s) => s.branch))].map((b, i) => (
                  <option key={i} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              {/* SEMESTER */}
              <select
                value={coSemester}
                onChange={(e) => {
                  setCoSemester(e.target.value);
                  setCoSubject("");
                }}
                className="border px-4 py-2 rounded"
                disabled={!coBranch}
              >
                <option value="">Select Semester</option>
                {[
                  ...new Set(
                    subjects
                      .filter((s) => s.branch === coBranch)
                      .map((s) => s.semester),
                  ),
                ].map((s, i) => (
                  <option key={i} value={s}>
                    Sem {s}
                  </option>
                ))}
              </select>

              {/* SUBJECT */}
              <select
                value={coSubject}
                onChange={(e) => setCoSubject(e.target.value)}
                className="border px-4 py-2 rounded"
                disabled={!coSemester}
              >
                <option value="">Select Subject</option>
                {subjects
                  .filter(
                    (s) =>
                      s.branch?.toUpperCase().trim() ===
                      coBranch.toUpperCase().trim() &&
                      s.semester.toString() === coSemester.toString(),
                  )
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.subject_name} ({s.subject_code})
                    </option>
                  ))}
              </select>
            </div>

            {/* DATA */}
            <div className="max-h-[400px] overflow-y-auto">
              {coData.length === 0 ? (
                <p className="text-gray-500">No CO data found</p>
              ) : (
                coData.map((sub: any, i: number) => (
                  <div key={i} className="mb-4 border-b pb-3">
                    <h3 className="font-semibold text-lg">
                      {sub.subject_name}
                    </h3>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {sub.co.map((c: any) => (
                        <span
                          key={c.id}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          {c.co_number}: {c.description}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* DOWNLOAD BUTTON */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  if (!coBranch || !coSemester || !coSubject) {
                    alert("Please select branch, semester and subject");
                    return;
                  }
                  const url = `http://127.0.0.1:8000/api/download-co-pdf/?branch=${coBranch}&semester=${coSemester}&subject_id=${coSubject}`;

                  window.open(url, "_blank");
                }}
                className="bg-blue-700 text-white px-4 py-2 rounded shadow hover:bg-blue-800"
              >
                Download PDF
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
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="border px-4 py-2 rounded"
              >
                <option value="">All Subjects</option>

                {subjects
                  .filter(
                    (s) =>
                      !selectedCOBranch ||
                      s.branch?.toUpperCase().trim() === selectedCOBranch,
                  )
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.subject_name} ({s.subject_code})
                    </option>
                  ))}
              </select>
            </div>

            {/* TABLE */}
            <div className="bg-white border rounded-lg overflow-x-auto max-h-[400px]">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-2">Student Name</th>
                    <th className="px-4 py-2">Reg No</th>
                    <th className="px-4 py-2">Subject</th>

                    {coColumns.map((co, index) => (
                      <th key={index} className="px-4 py-2">
                        {co}
                      </th>
                    ))}

                    <th className="px-4 py-2">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {/* STUDENT ROWS */}
                  {coAnalyticsData.map((row, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{row.name}</td>
                      <td className="px-4 py-2">{row.registration_number}</td>
                      <td className="px-4 py-2">{row.subject}</td>

                      {coColumns.map((co, i) => (
                        <td key={i} className="px-4 py-2">
                          {row[co] || 0}
                        </td>
                      ))}

                      <td className="px-4 py-2 font-bold">{row.total}</td>
                    </tr>
                  ))}

                  {/*  AVERAGE ROW */}
                  {coAnalyticsData.length > 0 && (
                    <tr className="bg-blue-50 font-semibold">
                      <td className="px-4 py-2" colSpan={2}></td>
                      <td className="px-4 py-2">Average Marks</td>

                      {coColumns.map((co, i) => (
                        <td key={i} className="px-4 py-2">
                          {coAverages[co]}
                        </td>
                      ))}

                      <td></td>
                    </tr>
                  )}

                  {/* STUDENTS ≥ AVG ROW */}
                  {coAnalyticsData.length > 0 && (
                    <tr className="bg-green-50 font-semibold">
                      <td className="px-4 py-2" colSpan={2}></td>
                      <td className="px-4 py-2">Students ≥ Avg</td>

                      {coColumns.map((co, i) => (
                        <td key={i} className="px-4 py-2">
                          {coAboveAvg[co]}
                        </td>
                      ))}

                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* EXPORT */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  //  Check branch
                  if (!selectedCOBranch) {
                    alert("Please select branch");
                    return;
                  }

                  //  Get selected subject
                  const selectedSub = subjects.find(
                    (s) => s.id == selectedSubjectId,
                  );

                  // Check subject
                  if (!selectedSub) {
                    alert("Please select subject");
                    return;
                  }

                  //  Correct semester
                  const semester = selectedSub.semester;

                  //  Encode subject (IMPORTANT)
                  const encodedSubject = encodeURIComponent(
                    selectedSub.subject_name,
                  );

                  const url = `http://127.0.0.1:8000/api/download-excel/${selectedCOBranch}/${semester}/?subject=${encodedSubject}`;

                  console.log("DOWNLOAD URL:", url);

                  window.open(url, "_blank");
                }}
                className="bg-blue-700 text-white px-4 py-2 rounded shadow"
              >
                Download Excel
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
            <div className="flex gap-4 mb-4">
              {/* Branch */}
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="border px-4 py-2 rounded"
              >
                <option value="">All Branches</option>
                {[...new Set(coaData.map((c) => c.branch).filter(Boolean))].map(
                  (b, i) => (
                    <option key={i} value={b}>
                      {b}
                    </option>
                  ),
                )}
              </select>

              {/* Semester */}
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="border px-4 py-2 rounded"
              >
                <option value="">All Semesters</option>
                {[
                  ...new Set(coaData.map((c) => c.semester).filter(Boolean)),
                ].map((s, i) => (
                  <option key={i} value={s}>
                    Sem {s}
                  </option>
                ))}
              </select>
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
                    <th className="px-6 py-3">Level</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((c, index) => (
                      <tr key={index} className="border-t hover:bg-slate-50">
                        <td className="px-6 py-3">{c.branch}</td>
                        <td className="px-6 py-3">{c.subject}</td>
                        <td className="px-6 py-3">{c.semester}</td>
                        <td className="px-6 py-3 font-semibold text-blue-700">
                          {c.attainment}
                        </td>
                        <td className="px-6 py-3 font-semibold text-green-600">
                          Level {c.level}
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
                  if (filteredData.length === 0) {
                    alert("No data to export");
                    return;
                  }

                  // Create CSV content
                  const headers = [
                    "Branch",
                    "Subject",
                    "Semester",
                    "Attainment",
                  ];

                  const rows = filteredData.map((item) => [
                    item.branch,
                    item.subject,
                    item.semester,
                    item.attainment,
                  ]);

                  const csvContent = [headers, ...rows]
                    .map((row) => row.join(","))
                    .join("\n");

                  // Create file and download
                  const blob = new Blob([csvContent], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);

                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "COA_Report.csv";
                  a.click();
                }}
                className="bg-blue-700 text-white px-4 py-2 rounded shadow"
              >
                Export Excel
              </button>
            </div>
          </div>
        </div>
      )}
      {showAttainment && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          <div className="relative bg-white w-[90%] max-w-xl rounded-2xl shadow-xl p-6 z-10">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Attainment Level</h3>

              <button
                onClick={() => setShowAttainment(false)}
                className="text-red-500 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* TEMP CONTENT */}
            {/* SESSION DROPDOWN */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Select Session</label>

              <select
                value={selectedSession}
                onChange={(e) => {
                  const session = e.target.value;

                  setSelectedSession(session);

                  //  RESET EVERYTHING (THIS IS KEY)
                  setShowSaved(false);
                  setIsModifyMode(false);
                  setSavedData(null);

                  setLevel1("");
                  setLevel2("");
                  setLevel3("");
                }}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="">Select Session</option>

                {sessions.map((session, index) => (
                  <option key={index} value={session}>
                    {session}
                  </option>
                ))}
              </select>
            </div>
            {/* LEVEL INPUTS */}
            {selectedSession && (
              <div className="mt-4">
                {/*  ALREADY SET */}
                {isAlreadySet && !isModifyMode && !showSaved && (
                  <div className="space-y-4">
                    <p className="text-green-600 font-semibold">
                      Already Set for this session
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowSaved(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        See Saved
                      </button>

                      <button
                        onClick={() => {
                          setIsModifyMode(true);

                          setLevel1(savedData.level1);
                          setLevel2(savedData.level2);
                          setLevel3(savedData.level3);
                        }}
                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                      >
                        Modify
                      </button>

                      <button
                        onClick={() => setShowAttainment(false)}
                        className="border px-4 py-2 rounded"
                      >
                        Don’t
                      </button>
                    </div>
                  </div>
                )}

                {/*  SEE SAVED */}
                {showSaved && savedData && (
                  <div className="space-y-3">
                    <p className="font-semibold">Saved Values:</p>

                    <p>Level 1: {savedData.level1}</p>
                    <p>Level 2: {savedData.level2}</p>
                    <p>Level 3: {savedData.level3}</p>

                    <button
                      onClick={() => setShowSaved(false)}
                      className="border px-4 py-2 rounded"
                    >
                      Back
                    </button>
                  </div>
                )}

                {/*  CASE 1: SHOW SAVED VALUES */}

                {/*  CASE 2: INPUT (NEW OR MODIFY) */}
                {(!isAlreadySet || isModifyMode) && !showSaved && (
                  <div className="space-y-4">
                    <p className="font-semibold">Enter Levels of Attainment</p>

                    <input
                      type="number"
                      value={level1}
                      onChange={(e) => setLevel1(e.target.value)}
                      placeholder="Level 1"
                      className="w-full border px-4 py-2 rounded"
                    />

                    <input
                      type="number"
                      value={level2}
                      onChange={(e) => setLevel2(e.target.value)}
                      placeholder="Level 2"
                      className="w-full border px-4 py-2 rounded"
                    />

                    <input
                      type="number"
                      value={level3}
                      onChange={(e) => setLevel3(e.target.value)}
                      placeholder="Level 3"
                      className="w-full border px-4 py-2 rounded"
                    />
                    {/*  MOVE SAVE BUTTON HERE */}
                    <button
                      onClick={handleSaveAttainment}
                      className="bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {/* po-pso details */}
      {showPOPSOModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* BACKDROP */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          {/* MODAL */}
          <div className="relative bg-white w-[90%] max-w-5xl max-h-[85vh] rounded-2xl shadow-xl z-10 flex flex-col">
            {/* HEADER */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">PO & PSO Details</h3>

              <button
                onClick={() => setShowPOPSOModal(false)}
                className="text-red-500 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* FILTERS */}
            <div className="flex gap-4 p-6 border-b">
              <select
                value={psoSession}
                onChange={(e) => setPsoSession(e.target.value)}
                className="border px-4 py-2 rounded"
              >
                <option value="">Select Session</option>
                {psoSessions.map((s: string, i: number) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={psoBranch}
                onChange={(e) => setPsoBranch(e.target.value)}
                className="border px-4 py-2 rounded"
              >
                <option value="">Select Branch</option>
                {psoBranches.map((b: string, i: number) => (
                  <option key={i} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="p-6 overflow-y-auto">
              {/* HOD */}
              {hodName && (
                <p className="mb-6 text-blue-700 font-semibold text-lg">
                  HOD: {hodName}
                </p>
              )}

              {/* PO SECTION */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4 border-b pb-2">
                  Program Outcomes (PO)
                </h4>

                <div className="space-y-3">
                  {poList.length === 0 ? (
                    <p className="text-gray-400">No PO found</p>
                  ) : (
                    poList.map((po: any, i) => (
                      <div
                        key={i}
                        className="bg-blue-50 border border-blue-100 p-4 rounded-lg"
                      >
                        <p className="font-semibold text-blue-800">
                          PO{i + 1}
                        </p>
                        <p className="text-gray-700 text-sm mt-1">
                          {po}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* PSO SECTION */}
              <div>
                <h4 className="text-lg font-semibold mb-4 border-b pb-2">
                  Program Specific Outcomes (PSO)
                </h4>

                <div className="space-y-3">
                  {psoList.length === 0 ? (
                    <p className="text-gray-400">No PSO found</p>
                  ) : (
                    psoList.map((pso: any, i) => (
                      <div
                        key={i}
                        className="bg-green-50 border border-green-100 p-4 rounded-lg"
                      >
                        <p className="font-semibold text-green-800">
                          PSO{i + 1}
                        </p>
                        <p className="text-gray-700 text-sm mt-1">
                          {pso}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => {
                  if (!psoSession || !psoBranch) {
                    alert("Select session and branch");
                    return;
                  }

                  const url = `http://127.0.0.1:8000/api/download-po-pso-pdf/?branch=${psoBranch}&session=${psoSession}`;
                  window.open(url, "_blank");
                }}
                className="bg-blue-700 text-white px-4 py-2 rounded"
              >
                Download PDF
              </button>

              <button
                onClick={() => setShowPOPSOModal(false)}
                className="border px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/*CO-PO-PSO Mapping */}
      {showMappingModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* BACKDROP */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          {/* MODAL */}
          <div className="relative bg-white w-[95%] max-w-7xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col z-10">
            {/* HEADER */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">CO–PO–PSO Mapping</h3>

              <button
                onClick={() => setShowMappingModal(false)}
                className="text-red-500 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* FILTERS */}
            <div className="flex gap-4 p-6 border-b">
              <select
                value={psoSession}
                onChange={(e) => setPsoSession(e.target.value)}
                className="border px-4 py-2 rounded"
              >
                <option value="">Select Session</option>
                {psoSessions.map((s: string, i: number) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={psoBranch}
                onChange={(e) => setPsoBranch(e.target.value)}
                className="border px-4 py-2 rounded"
              >
                <option value="">Select Branch</option>
                {psoBranches.map((b: string, i: number) => (
                  <option key={i} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <select
                value={mappingSubject}
                onChange={(e) => setMappingSubject(e.target.value)}
                className="border px-4 py-2 rounded"
              >
                <option value="">Select Subject</option>

                {mappingSubjects.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.subject_name} ({s.subject_code})
                  </option>
                ))}
              </select>
            </div>

            {/* CONTENT */}
            <div className="p-6 overflow-y-auto">
              {mappingData.length === 0 ? (
                <p className="text-gray-400">No Mapping Found</p>
              ) : (
                mappingData.map((item: any, index: number) => (
                  <div key={index} className="mb-8 border rounded-lg p-4">
                    {/* SUBJECT + FACULTY */}
                    <div className="flex justify-between mb-3">
                      <p className="font-semibold text-blue-700 text-lg">
                        {item.subject_name}
                      </p>

                      <p className="text-sm text-gray-600">
                        Faculty: {item.faculty}
                      </p>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto">
                      <table className="w-full border text-sm">
                        {/* HEADER */}
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border px-2 py-2">CO</th>

                            {/* PO HEADERS */}
                            {poList.map((_, i: number) => (
                              <th key={i} className="border px-2 py-2"
                              >PO{i + 1}</th>
                            ))}

                            {/* PSO HEADERS */}
                            {psoList.map((pso: any, i: number) => (
                              <th key={i} className="border px-2 py-2">
                                {pso.code}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        {/* BODY */}
                        <tbody>
                          {item.co_data.map((co: any, i: number) => (
                            <tr key={i} className="text-center">
                              {/* CO */}
                              <td className="border px-2 py-2 font-semibold">
                                CO{co.co_number}
                              </td>

                              {/* PO VALUES */}
                              {poList.map((_, j: number) => {
                                const key = `PO${j + 1}`;
                                return (
                                  <td key={j} className="border px-2 py-2">
                                    {co.po_mapping?.[key] ?? "-"}
                                  </td>
                                );
                              })}

                              {/* PSO VALUES */}
                              {
                                psoList.map((_, j: number) => {
                                  const key = `PSO${j + 1}`;
                                  return (
                                    <td key={j} className="border px-2 py-2">
                                      {co.pso_mapping?.[key] ?? "-"}
                                    </td>
                                  );
                                })
                              }
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 p-6 border-t">
              {/* DOWNLOAD */}
              <button
                onClick={() => {
                  if (!psoSession || !psoBranch) {
                    alert("Select session and branch");
                    return;
                  }

                  const url = `http://127.0.0.1:8000/api/download-mapping-excel-principal/?branch=${psoBranch}&session=${psoSession}`;
                  window.open(url, "_blank");
                }}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Download Excel
              </button>

              {/* CLOSE */}
              <button
                onClick={() => setShowMappingModal(false)}
                className="border px-4 py-2 rounded"
              >
                Close
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
