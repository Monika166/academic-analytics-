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
console.log("Principal page loaded");
const PrincipalLogin: React.FC = () => {
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
          login_type: "PRINCIPAL", // 🔥 IMPORTANT
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("faculty_id", data.faculty_id);
        localStorage.setItem("faculty_name", data.faculty_name);
        localStorage.setItem("faculty_designation", data.faculty_designation);
        localStorage.setItem("faculty_email", data.email);
        localStorage.setItem("faculty_phone", data.phone);

        localStorage.setItem("userRole", "principal");

        navigate("/principal-dashboard"); // 🔥 you will create later
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

        {/* LEFT SAME DESIGN */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 to-indigo-900 p-16 flex-col justify-between">
          <div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/80 mb-12"
            >
              <ChevronLeft size={20} />
              Back to website
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
                <GraduationCap className="text-blue-700 w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                Academic Analytics
              </h1>
            </div>

            <h2 className="text-5xl font-extrabold text-white leading-tight">
              Empowering <br />
              Data-Driven <br />
              Teaching
            </h2>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-20">
          <div className="max-w-md mx-auto w-full">

            <h3 className="text-3xl font-bold mb-2">
              Principal Login
            </h3>
            <p className="text-slate-500 mb-8">
              Access full academic analytics dashboard
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 p-3 border rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 p-3 border rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <button className="w-full bg-blue-700 text-white py-3 rounded-xl">
                Login to Dashboard →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalLogin;