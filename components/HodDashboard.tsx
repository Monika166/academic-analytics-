import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Plus,
  User,
  BookOpen,
  ChevronDown,
  Settings,
  UserCircle,
  HelpCircle,
  LogOut,
} from "lucide-react";

interface Subject {
  code: string;
  name: string;
  semester: number;
  status: "ACTIVE" | "INACTIVE";
}

const HodDashboard: React.FC = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedSemester, setSelectedSemester] = useState<string>("1");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State for HOD details
  const [hodName, setHodName] = useState("user");
  const [branch, setBranch] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("faculty_name");
    const storedBranch = localStorage.getItem("faculty_branch");

    if (storedName) setHodName(storedName);
    if (storedBranch) setBranch(storedBranch);
    const fetchSubjects = async () => {
      const facultyId = localStorage.getItem("faculty_id");

      if (!facultyId) return;

      const response = await fetch(
        "http://127.0.0.1:8000/api/get-hod-subjects/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            faculty_id: facultyId,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSubjects(data.subjects);
      }
    };

    fetchSubjects();
  }, []);

  const [subjects, setSubjects] = useState<any[]>([]);
  const filteredSubjects =
    selectedSemester === "all"
      ? subjects
      : subjects.filter((s) => s.semester === Number(selectedSemester));

  const semesters = ["all", "1", "2", "3", "4", "5", "6", "7", "8"];

  const handleLogoutConfirm = () => {
    localStorage.clear();
    setIsLogoutModalOpen(false);
    navigate("/hod-login");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ================= NAVBAR ================= */}
      <header className="h-[70px] bg-white border-b border-slate-100 shadow-sm flex items-center relative z-50">
        <div className="max-w-[1200px] w-full mx-auto px-6 flex justify-between items-center">
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

          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <div className="text-right hidden sm:block">
              {/* <p className="text-sm font-bold text-slate-800 leading-none mb-1">
                Prof. {hodName}
              </p> */}
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                  HEAD OF DEPT
                </span>
                <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-tighter mt-0.5">
                  {branch}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 group focus:outline-none"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 border-2 border-transparent group-hover:border-blue-200 transition-all shadow-sm">
                <User size={20} />
              </div>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-slate-50 sm:hidden">
                  <p className="text-sm font-bold text-slate-800">
                    Prof. {hodName}
                  </p>
                  <p className="text-[10px] text-blue-600 font-bold uppercase">
                    {branch} HOD
                  </p>
                </div>

                <button
                  onClick={() => navigate("/profile")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <UserCircle size={18} /> My Profile
                </button>

                <button
                  onClick={() => navigate("/settings")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <Settings size={18} /> Settings
                </button>

                <button
                  onClick={() => navigate("/support")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <HelpCircle size={18} /> Support Center
                </button>

                <div className="h-px bg-slate-100 my-1 mx-2" />

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-semibold"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Top Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              HOD Dashboard
            </h1>
            <p className="text-slate-500">
              Manage department subjects and academic curriculum.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/add-subject")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus size={18} />
              Add Subject
            </button>

            <button
              onClick={() => navigate("/hod-add-student")}
              className="bg-white border border-slate-200 px-6 py-3 rounded-xl hover:bg-slate-50 transition flex items-center gap-2"
            >
              <Plus size={18} />
              Add Student
            </button>
          </div>
        </div>

        {/* ================= SUBJECT CONTAINER ================= */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">
              Department Subjects
            </h2>
          </div>

          {/* ===== SEMESTER SLIDING BAR ===== */}
          <div className="relative mb-8">
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth"
            >
              {semesters.map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    selectedSemester === sem
                      ? "bg-blue-600 text-white shadow-lg translate-y-[-1px]"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {sem === "all"
                    ? "All Semesters"
                    : `${sem}${
                        sem === "1"
                          ? "st"
                          : sem === "2"
                            ? "nd"
                            : sem === "3"
                              ? "rd"
                              : "th"
                      } Sem`}
                </button>
              ))}
            </div>
          </div>

          {/* ===== SUBJECT CARDS ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject, index) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                      SEMESTER {subject.semester}
                    </span>

                    <span
                      className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                        subject.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {subject.is_active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                    {subject.subject_code}
                  </h3>

                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    {subject.subject_name}
                  </p>

                  <div className="flex justify-between items-center text-[11px] pt-4 border-t border-slate-200">
                    <div className="flex flex-col text-slate-500 font-semibold uppercase tracking-wide">
                      <span>Session: {subject.session}</span>
                      <span>Batch: {subject.batch}</span>
                    </div>

                    <button
                      onClick={() =>
                        navigate("/edit-subject", {
                          state: { subject },
                        })
                      }
                      className="text-blue-600 font-bold hover:text-blue-800 transition-colors"
                    >
                      Edit Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium italic">
                  No subjects registered for this semester.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* ================= LOGOUT MODAL ================= */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsLogoutModalOpen(false)}
          ></div>

          {/* Modal */}
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
                <LogOut size={28} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Are you sure you want to logout?
              </h3>

              <p className="text-slate-500 mb-8">
                You will be redirected to the HOD login page and your session
                will be closed.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl"
                >
                  Yes, Logout
                </button>

                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 font-bold py-3 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default HodDashboard;
