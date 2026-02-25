import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  User,
  Mail,
  Phone,
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  ChevronLeft,
  CheckCircle2,
  ArrowRight,
  School, // Icon for Branch
} from "lucide-react";

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    designation: "",
    branch: "", // Added branch to state
    password: "",
    confirmPassword: "",
  });

  // Check if designation is HOD to trigger the extra field
  const isHOD = formData.designation.trim().toUpperCase() === "HOD";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          designation: formData.designation,
          // Send branch only if HOD, else send null
          branch: isHOD ? formData.branch : null,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("faculty_id", data.id);
        localStorage.setItem("faculty_name", data.full_name);
        localStorage.setItem("faculty_designation", data.designation);
        localStorage.setItem("faculty_email", data.email);
        localStorage.setItem("faculty_phone", data.phone);

        // CRITICAL: Save the branch from the backend response
        // If the user is an HOD, data.branch will contain the branch name
        if (data.branch) {
          localStorage.setItem("faculty_branch", data.branch);
        } else {
          localStorage.removeItem("faculty_branch"); // Clear if not HOD
        }

        setIsSuccess(true);
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error. Make sure backend is running.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans overflow-x-hidden">
      <div className="w-full max-w-7xl h-full lg:h-[850px] flex flex-col lg:flex-row bg-white lg:shadow-2xl lg:rounded-2xl overflow-hidden m-0 lg:m-6">
        {/* LEFT SECTION (Unchanged) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-indigo-800 p-16 flex-col justify-between overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="350" cy="50" r="100" fill="white" />
              <rect
                x="-50"
                y="300"
                width="200"
                height="200"
                rx="40"
                transform="rotate(25)"
                fill="white"
              />
            </svg>
          </div>
          <div className="relative z-10">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-12 group"
            >
              <ChevronLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <GraduationCap className="text-blue-700 w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Academic Analytics
              </h1>
            </div>
            <div className="space-y-8">
              <h2 className="text-5xl font-extrabold text-white leading-tight">
                Join <br /> Academic <br /> Analytics
              </h2>
              <p className="text-blue-100 text-lg max-w-md leading-relaxed">
                Empowering Professors with Data-Driven Insights. Create your
                faculty profile and start transforming student outcomes with
                precision analytics.
              </p>
            </div>
          </div>
          <div className="relative z-10 border-t border-white/10 pt-8 flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <CheckCircle2 className="text-blue-300 w-6 h-6" />
            </div>
            <p className="text-sm text-blue-200 font-medium">
              Verified platform for 50+ leading institutions.
            </p>
          </div>
        </div>

        {/* RIGHT SECTION: Registration Form */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-12 bg-white overflow-y-auto">
          <div className="max-w-[450px] mx-auto w-full">
            <div className="mb-8 text-center lg:text-left">
              <h3 className="text-3xl font-bold text-slate-900 mb-2">
                Register as Faculty
              </h3>
              <p className="text-slate-500">
                Create your account to get started
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Phone & Designation Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Phone size={18} />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Designation
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Briefcase size={18} />
                    </div>
                    <select
                      required
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          designation: e.target.value,
                        })
                      }
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm appearance-none"
                    >
                      <option value="">Select Designation</option>
                      <option value="Professor">Professor</option>
                      <option value="HOD">HOD</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* CONDITIONAL BRANCH OPTION (Strict UI Consistency) */}
              {isHOD && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-xs font-bold text-blue-600 uppercase tracking-wider ml-1">
                    Select Branch
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <School size={18} />
                    </div>
                    <select
                      required
                      value={formData.branch}
                      onChange={(e) =>
                        setFormData({ ...formData, branch: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-3 bg-blue-50/30 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm appearance-none"
                    >
                      <option value="">Choose Branch</option>
                      <option value="CSE">Computer Science (CSE)</option>
                      <option value="ECE">Electronics & Comm (ECE)</option>
                      <option value="ME">Mechanical Engineering</option>
                      <option value="CE">Civil Engineering</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Create Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-700/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group mt-2"
              >
                <span>Register</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-700 font-bold hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL (Unchanged) */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"></div>
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <CheckCircle2 size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Registration Successful!
            </h3>
            <p className="text-slate-500 mb-8">
              Your account has been created successfully. Redirecting to
              login...
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
