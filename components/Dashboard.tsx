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
              onClick={() => navigate("/add-co")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              + Add CO
            </button>
            <button className="bg-white border border-slate-200 hover:border-blue-700 hover:text-blue-700 text-slate-700 font-bold px-6 py-3 rounded-xl shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
              <Activity size={20} />
              <span>View Activity</span>
            </button>
          </div>
        </div>

        {/* Scalable Grid for Future Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coList.length === 0 ? (
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
            coList.map((co, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-md border border-slate-100 p-10 min-h-[320px] hover:shadow-xl transition-all"
              >
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  CO #{index + 1}
                </h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Batch</span>
                    <span className="font-medium">{co.batch}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Session</span>
                    <span className="font-medium">{co.session}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Semester</span>
                    <span className="font-medium">{co.semester}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Subject</span>
                    <span className="text-blue-600 font-semibold">
                      {co.subjectCode}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">COs</span>
                    <span className="font-medium">{co.numberOfCO}</span>
                  </div>
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
    </div>
  );
};

export default Dashboard;
