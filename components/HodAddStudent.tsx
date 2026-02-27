import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ChevronLeft, User, Upload } from "lucide-react";

const HodAddStudent: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const hodBranch = localStorage.getItem("faculty_branch") || "";
  const [students, setStudents] = useState<any[]>([]);
  const [session, setSession] = useState("");
  const [batch, setBatch] = useState("");
  const [semester, setSemester] = useState("");
  // const [branch, setBranch] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    if (!session || !batch || !semester) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true); // 🔥 START LOADING

    const formData = new FormData();
    formData.append("file", file);
    formData.append("session", session);
    formData.append("batch", batch);
    formData.append("semester", semester);
    formData.append("branch", hodBranch);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/upload-students/",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        await fetchStudents();
        setFile(null);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false); // 🔥 STOP LOADING
    }
  };
  const fetchStudents = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/get-students/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session,
          batch,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* NAVBAR */}
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

      {/* MAIN */}
      <main className="max-w-[900px] mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/hod-dashboard")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ChevronLeft size={18} />
          Back to HOD Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Add New Student
          </h1>
          <p className="text-slate-500 mb-8">
            Enroll a new student into the department database.
          </p>

          <div className="space-y-6">
            {/* Session */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                SESSION
              </label>
              <input
                type="text"
                placeholder="e.g. Summer 2024"
                value={session}
                onChange={(e) => setSession(e.target.value)}
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
                placeholder="e.g. 2024-2028"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
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
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
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
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                BRANCH
              </label>
              <input
                type="text"
                value={hodBranch}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3"
              />
            </div>
            {/* Upload CSV */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                UPLOAD STUDENT DATA (CSV)
              </label>

              <label
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition ${
                  loading
                    ? "bg-blue-50 border-blue-400"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Upload size={32} className="text-blue-600 mb-3" />

                {!file ? (
                  <>
                    <p className="text-slate-600 font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-400">
                      CSV files only (max. 10MB)
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-green-600 font-semibold">
                      ✅ {file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      File selected successfully
                    </p>
                  </>
                )}

                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
            {/* Upload Button */}
            <button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-600/20"
              } text-white`}
            >
              {loading ? "Uploading..." : "Upload and Enroll Students"}
            </button>
            {students.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">Uploaded Students</h2>

                <div className="overflow-x-auto">
                  <table className="w-full border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-3 text-left">Roll No</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Semester</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-t">
                          <td className="p-3">{student.roll_number}</td>
                          <td className="p-3">{student.full_name}</td>
                          <td className="p-3">{student.email}</td>
                          <td className="p-3">{student.semester}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HodAddStudent;
