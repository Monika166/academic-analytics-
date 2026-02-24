import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ChevronLeft, User, Upload } from "lucide-react";

const HodAddStudent: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    session: "",
    batch: "",
    semester: "",
    file: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        file: e.target.files[0],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);

    // Later connect to backend
    alert("Students uploaded successfully!");
    navigate("/hod-dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ================= NAVBAR ================= */}
      <header className="h-[70px] bg-white border-b border-slate-100 shadow-sm flex items-center">
        <div className="max-w-[1200px] w-full mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center shadow-md">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-slate-800">
              Academic Analytics
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 uppercase tracking-widest">
              HEAD OF DEPT
            </span>
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
              <User size={18} />
            </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-[900px] mx-auto px-6 py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/hod-dashboard")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ChevronLeft size={18} />
          Back to HOD Dashboard
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Add New Student
          </h1>
          <p className="text-slate-500 mb-8">
            Enroll a new student into the department database.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Session */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                SESSION
              </label>
              <input
                type="text"
                name="session"
                placeholder="e.g. Summer 2024"
                value={formData.session}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            {/* Batch */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                BATCH
              </label>
              <input
                type="text"
                name="batch"
                placeholder="e.g. 2024-2028"
                value={formData.batch}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                SEMESTER
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              >
                <option value="">Select Semester</option>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
                <option value="3">3rd Semester</option>
                <option value="4">4th Semester</option>
                <option value="5">5th Semester</option>
                <option value="6">6th Semester</option>
                <option value="7">7th Semester</option>
                <option value="8">8th Semester</option>
              </select>
            </div>

            {/* Upload CSV */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                UPLOAD STUDENT DATA (CSV)
              </label>

              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
                <Upload size={32} className="text-blue-600 mb-3" />
                <p className="text-slate-600 font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-400">
                  CSV files only (max. 10MB)
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              Upload and Enroll Students
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default HodAddStudent;
