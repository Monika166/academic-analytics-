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
  const filteredStudents = students.filter((student) => {
    return (
      (selectedBranch === "" || student.branch === selectedBranch) &&
      (selectedSemester === "" ||
        student.semester.toString() === selectedSemester)
    );
  });
  const uniqueBranches = [
    ...new Set(
      students.map((s) => s.branch?.trim().toUpperCase()).filter(Boolean),
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
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h3 className="text-slate-500 text-sm">Total Faculty</h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">
              {stats.faculty}
            </p>
          </div>

          {/* SUBJECTS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h3 className="text-slate-500 text-sm">Total Subjects</h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">
              {stats.subjects}
            </p>
          </div>
        </div>
      </div>
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
