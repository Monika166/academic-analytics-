import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronLeft,
  ArrowRight,
} from "lucide-react";

// interface LoginPageProps {
//   onBack: () => void;
//   onLoginSuccess: () => void;
// }

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          login_type: "FACULTY",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("faculty_id", data.faculty_id);
        localStorage.setItem("faculty_name", data.faculty_name);
        localStorage.setItem("faculty_designation", data.faculty_designation);
        localStorage.setItem("faculty_email", data.email);
        localStorage.setItem("faculty_phone", data.phone);

        localStorage.setItem("userRole", "faculty");

        navigate("/dashboard"); // ✅ ALWAYS go to faculty dashboard
      } else {
        alert(data.error || "Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      alert("Server error. Make sure backend is running.");
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
      <div className="w-full max-w-7xl h-full lg:h-[800px] flex flex-col lg:flex-row bg-white lg:shadow-2xl lg:rounded-2xl overflow-hidden m-0 lg:m-6">
        {/* LEFT SECTION: Branding (Desktop Only) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-700 to-indigo-900 p-16 flex-col justify-between overflow-hidden">
          {/* Abstract vector background elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-12 group"
            >
              <ChevronLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Back to website</span>
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="text-blue-700 w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Academic Analytics
              </h1>
            </div>

            <div className="space-y-6">
              <h2 className="text-5xl font-extrabold text-white leading-tight">
                Empowering <br />
                Data-Driven <br />
                Teaching
              </h2>
              <p className="text-blue-100 text-lg max-w-md leading-relaxed">
                A unified platform for professors to analyze performance, map
                learning outcomes, and enhance pedagogical strategies.
              </p>
            </div>
          </div>

          <div className="relative z-10 border-t border-white/10 pt-8">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-blue-800 bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700"
                  >
                    P{i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-blue-200">
                Joined by 200+ Faculty Members this month
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: Login Form */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-20 bg-white">
          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center mb-10 text-center">
            <button
              onClick={() => navigate("/")}
              className="self-start flex items-center gap-1 text-slate-500 text-sm mb-6"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
            <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-blue-700/20">
              <GraduationCap className="text-white w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Academic Analytics
            </h1>
            <p className="text-slate-500 text-sm">Professor Dashboard</p>
          </div>

          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center lg:text-left">
              <h3 className="text-3xl font-bold text-slate-900 mb-2">
                Professor Login
              </h3>
              <p className="text-slate-500">
                Access your academic analytics dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email / Phone Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Email or Phone Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your email or phone number"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-700/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
              >
                <span>Login to Dashboard</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">
                    OR
                  </span>
                </div>
              </div>

              {/* Google Login (Optional Placeholder) */}
              <button
                type="button"
                className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.35 0 2.57.46 3.52 1.36l2.64-2.64C16.56 2.18 14.43 1.5 12 1.5c-4.12 0-7.65 2.45-9.17 5.96l3.07 2.38C6.63 7.02 9.09 5.04 12 5.04z"
                  />
                  <path
                    fill="#4285F4"
                    d="M22.01 12.3c0-.64-.05-1.25-.15-1.84H12v3.48h5.61c-.24 1.25-.95 2.31-2.01 3.02l3.14 2.44C20.61 17.65 22.01 15.19 22.01 12.3z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.9 14.84c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L2.83 7.88C2.1 9.3 1.5 10.9 1.5 12.61c0 1.71.6 3.31 1.33 4.73l3.07-2.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 22.5c2.43 0 4.47-.81 5.96-2.19l-3.14-2.44c-.83.56-1.89.89-2.82.89-2.91 0-5.37-1.98-6.25-4.65L2.66 16.59C4.18 20.1 7.71 22.5 12 22.5z"
                  />
                </svg>
                <span>Continue with Institution Google SSO</span>
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-slate-500 text-sm">
                Don’t have an account?{" "}
                <a
                  href="mailto:admin@academicanalytics.edu"
                  className="text-blue-700 font-bold hover:underline"
                >
                  Contact Administrator
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
