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

  useEffect(() => {
    const name = localStorage.getItem("faculty_name");
    if (name) setPrincipalName(name);
  }, []);

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