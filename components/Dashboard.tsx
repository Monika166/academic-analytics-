import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  ChevronDown,
  LogOut,
  Plus,
  Activity,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";

// interface DashboardProps {
//   onLogout: () => void;
// }

interface CourseOutcome {
  batch: string;
  session: string;
  semester: string;
  branch: string;
  subjectCode: string;
  subjectName: string;
  numberOfCO: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [facultyName, setFacultyName] = useState("");
  const [facultyDesignation, setFacultyDesignation] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [coList, setCoList] = useState<CourseOutcome[]>([]);
  const [branchSemesterList, setBranchSemesterList] = useState<any[]>([]);
  const [showPOPSOModal, setShowPOPSOModal] = useState(false);
  const [branch, setBranch] = useState("");
  const [sessions, setSessions] = useState<string[]>([]);
  const [session, setSession] = useState("");
  const [poList, setPoList] = useState([]);
  const [psoList, setPsoList] = useState([]);
  const [branches, setBranches] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get-branches/")
      .then((res) => res.json())
      .then((data) => {
        setBranches(data);
      });
  }, []);

  useEffect(() => {
    if (branch) {
      fetch(`http://127.0.0.1:8000/api/get-po-pso-sessions/?branch=${branch}`)
        .then((res) => res.json())
        .then((data) => setSessions(data));
    }
  }, [branch]);

  useEffect(() => {
    const name = localStorage.getItem("faculty_name");
    const id = localStorage.getItem("faculty_id");

    if (!id) {
      navigate("/login");
      return;
    }

    const designation = localStorage.getItem("faculty_designation");

    if (name) setFacultyName(name);
    if (designation) setFacultyDesignation(designation);
  }, [navigate]);

  useEffect(() => {
    if (location.state) {
      setCoList([location.state as CourseOutcome]);
    }
  }, [location.state]);

  useEffect(() => {
    const facultyId = localStorage.getItem("faculty_id");

    fetch(`http://127.0.0.1:8000/api/branch-semester/?faculty_id=${facultyId}`)
      .then((res) => res.json())
      .then((data) => {
        setBranchSemesterList(data);
      })
      .catch((err) => console.error(err));
  }, [location]);

  const fetchPOPSO = async (selectedSession: string) => {
    setSession(selectedSession);

    if (!branch || !selectedSession) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/get-po-pso/?branch=${branch}&session=${selectedSession}`
      );

      const data = await res.json();

      setPoList(data.po || []);
      setPsoList(data.pso || []);

    } catch (err) {
      console.error(err);
    }
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("faculty_name");
    localStorage.removeItem("faculty_id");
    localStorage.removeItem("faculty_designation");
    setIsLogoutModalOpen(false);
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 h-[70px] bg-white border-b border-slate-100 shadow-sm flex items-center">
        <div className="max-w-[1200px] w-full mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center shadow-md">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight hidden sm:block">
              Academic Analytics
            </span>
          </div>

          {/* User Profile Section */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-1.5 pl-3 hover:bg-slate-50 rounded-full transition-colors border border-transparent hover:border-slate-100"
            >
              <div className="flex flex-col items-end mr-1 hidden sm:flex">
                <span className="text-sm font-bold text-slate-800">
                  Prof. {facultyName}
                </span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                  {facultyDesignation}
                </span>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 border-2 border-white shadow-sm overflow-hidden">
                <User size={20} />
              </div>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-slate-50 mb-1 lg:hidden">
                  <p className="text-sm font-bold text-slate-800">
                    {facultyName}
                  </p>
                  <p className="text-xs text-slate-400">Department Head</p>
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                >
                  <User size={16} />
                  <span>My Profile</span>
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                  <HelpCircle size={16} />
                  <span>Support Center</span>
                </button>
                <div className="h-px bg-slate-50 my-1"></div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. DASHBOARD CONTENT */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
              Professor Dashboard
            </h1>
            <p className="text-slate-500">
              Welcome back, Prof. {facultyName}. Here's what's happening today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/co-management")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Manage CO Details
            </button>
            <button
              onClick={() => navigate("/select-subject-marks")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Add CO Marks
            </button>
            <button
              onClick={() => setShowPOPSOModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              View PO/PSO
            </button>
          </div>
        </div>

        {/* Scalable Grid for Future Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branchSemesterList.length === 0 ? (
            <div className="h-64 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-white/50">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <Plus size={24} />
              </div>
              <p className="font-bold text-slate-800 mb-1">
                No Course Outcomes added yet
              </p>
              <p className="text-xs text-slate-400">
                Start by adding your first curriculum subject to begin tracking
                performance.
              </p>
            </div>
          ) : (
            branchSemesterList.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-md border border-slate-100 p-10 min-h-[220px] hover:shadow-xl transition-all"
              >
                <h2 className="text-lg font-bold text-slate-900 mb-6">
                  Semester {item.semester}
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Batch</span>
                    <span className="font-medium">{item.batch}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Session</span>
                    <span className="font-medium">{item.session}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Branch</span>
                    <span className="font-medium">{item.branch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subject</span>
                    <span className="font-medium">{item.subject}</span>
                  </div>

                  <button
                    className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={() =>
                      window.open(
                        `http://127.0.0.1:8000/api/download-excel/${item.branch}/${item.semester}/?subject=${item.subject}`,
                      )
                    }
                  >
                    Download CO Attainment
                  </button>
                  <button
                    className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                    onClick={() =>
                      window.open(
                        `http://127.0.0.1:8000/api/download-mapping-excel/?branch=${item.branch}&session=${item.session}&subject=${item.subject}&subject_id=${item.subject_id}`
                      )
                    }
                  >
                    Download CO-PO-PSO Mapping
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* 3. LOGOUT MODAL */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsLogoutModalOpen(false)}
          ></div>

          {/* Modal Card */}
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
                <LogOut size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Are you sure you want to logout?
              </h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                You will be redirected to the login page and your current
                session will be closed.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showPOPSOModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[600px] max-h-[80vh] overflow-y-auto relative">

            {/* CLOSE */}
            <button
              onClick={() => setShowPOPSOModal(false)}
              className="absolute top-2 right-3 text-xl"
            >
              ×
            </button>

            {/* HEADING */}
            <h2 className="text-xl font-bold text-center mb-4">
              PO PSO Details
            </h2>



            <div className="flex gap-2 mb-4">

              {/* BRANCH DROPDOWN */}
              <select
                value={branch}
                onChange={(e) => {
                  setBranch(e.target.value);
                  setSession("");
                  setPoList([]);
                  setPsoList([]);
                }}
                className="w-1/2 border p-2 rounded"
              >
                <option value="">Select Branch</option>
                {branches.map((b, i) => (
                  <option key={i} value={b}>{b}</option>
                ))}
              </select>

              {/* SESSION DROPDOWN */}
              <select
                value={session}
                onChange={(e) => fetchPOPSO(e.target.value)}
                className="w-1/2 border p-2 rounded"
              >
                <option value="">Select Session</option>
                {sessions.map((s, i) => (
                  <option key={i} value={s}>{s}</option>
                ))}
              </select>

            </div>

            {/* PO LIST */}
            {/* PO TABLE */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Program Outcomes</h3>

              <div className="border rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1">Code</th>
                      <th className="border px-2 py-1">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {poList?.length > 0 ? (
                      poList.map((po: any, i) => (
                        <tr key={i}>
                          <td className="border px-2 py-1 text-center">{po.code}</td>
                          <td className="border px-2 py-1">{po.description}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="text-center py-2">No POs found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PSO LIST */}
            {/* PSO TABLE */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Program Specific Outcomes</h3>

              <div className="border rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1">Code</th>
                      <th className="border px-2 py-1">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {psoList?.length > 0 ? (
                      psoList.map((pso: any, i) => (
                        <tr key={i}>
                          <td className="border px-2 py-1 text-center">{pso.code}</td>
                          <td className="border px-2 py-1">{pso.description}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="text-center py-2">No PSOs found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* DOWNLOAD */}
            <button
              onClick={() => {
                window.open(
                  `http://127.0.0.1:8000/api/download-po-pso-pdf/?branch=${branch}&session=${session}`
                );
              }}
              className="bg-green-600 text-white px-3 py-1.5 rounded text-sm mt-2 w-fit mx-auto block"
            >
              Download PDF
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
