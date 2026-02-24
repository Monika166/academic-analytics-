import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

<Link to="/profile">
  <button>Profile</button>
</Link>;
const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      // Show buttons after 150px of scroll
      if (window.scrollY > 150) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm py-3" : "bg-transparent py-5"}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 bg-blue-700 rounded-md flex items-center justify-center">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">
            Academic Analytics
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
          >
            Features
          </a>
          <a
            href="#process"
            className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
          >
            Process
          </a>
          <a
            href="#benefits"
            className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
          >
            Benefits
          </a>
        </div>

        {/* These buttons will only be visible when scrolled */}
        <div
          className={`flex items-center gap-4 transition-all duration-500 ease-in-out ${isScrolled ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"}`}
        >
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-semibold text-blue-700 hover:text-blue-800 px-4 py-2 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-md shadow-lg shadow-blue-700/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Register as Faculty
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
