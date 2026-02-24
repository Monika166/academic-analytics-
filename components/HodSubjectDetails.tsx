import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GraduationCap, ChevronLeft, User, BookOpen } from "lucide-react";

const AddSubject: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const numberOfSubjects = Number(location.state?.numberOfSubjects || 1);

  const [subjects, setSubjects] = useState(
    Array.from({ length: numberOfSubjects }, () => ({
      name: "",
      code: "",
    })),
  );

  const handleChange = (
    index: number,
    field: "name" | "code",
    value: string,
  ) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(subjects);

    // Later: send to backend
    navigate("/hod-dashboard");
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
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ChevronLeft size={18} />
          Back to Step 1
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Subject Details
          </h1>
          <p className="text-slate-500 mb-8">
            Enter the name and code for each of the {numberOfSubjects} subjects.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-100"
              >
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen size={18} className="text-blue-600" />
                  <h2 className="font-bold text-blue-700">
                    Subject {index + 1}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Subject Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      SUBJECT NAME
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Machine Learning"
                      value={subject.name}
                      onChange={(e) =>
                        handleChange(index, "name", e.target.value)
                      }
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    />
                  </div>

                  {/* Subject Code */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      SUBJECT CODE
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CS601"
                      value={subject.code}
                      onChange={(e) =>
                        handleChange(index, "code", e.target.value)
                      }
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              Register All Subjects
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddSubject;
