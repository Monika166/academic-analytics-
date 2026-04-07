import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "react-router-dom";
export default function SelectSubjectForMarks() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const facultyId = localStorage.getItem("faculty_id");

        if (!facultyId) {
          alert("User not logged in");
          return;
        }

        // 🔥 get data passed from previous page
        const state = history.state?.usr || {};

        const { branch, semester, batch, session } = state;

        const res = await fetch(
          `http://127.0.0.1:8000/api/subjects-with-co/?faculty_id=${facultyId}&branch=${branch}&semester=${semester}&batch=${batch}&session=${session}`,
        );

        const data = await res.json();
        setSubjects(data.subjects || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSubjects();
  }, []);
  const handleNext = () => {
    if (!selected) {
      alert("Please select a subject");
      return;
    }

    // 🔥 NEW CHECK
    if (selected.all_marks_filled) {
      alert("All CO marks already filled");
      return;
    }

    navigate("/batch", {
      state: {
        subject_id: selected.id,
        subjectCode: selected.subject_code,
        subjectName: selected.subject_name,
        branch: selected.branch,
        semester: selected.semester,
        batch: selected.batch,
        session: selected.session,
      },
    });
  };
  const isMarksExists = selected ? selected.all_marks_filled : false;
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
      </div>
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6">Select Subject</h2>

        <select
          className="w-full border p-3 rounded mb-4"
          onChange={(e) =>
            setSelected(subjects.find((s) => s.id === Number(e.target.value)))
          }
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.subject_name} ({sub.branch} - Sem {sub.semester} -{" "}
              {sub.subject_code})
            </option>
          ))}
        </select>
        {selected && selected.missing_cos?.length > 0 && (
          <p className="text-red-500 text-sm mb-3">
            Missing CO:{" "}
            {selected.missing_cos.map((co: number) => `CO${co}`).join(", ")}
          </p>
        )}

        <button
          onClick={handleNext}
          disabled={isMarksExists}
          className={`w-full py-2 rounded text-white ${
            isMarksExists ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
          }`}
        >
          {isMarksExists ? "CO Marks Already Added" : "Continue"}
        </button>
      </div>
    </div>
  );
}
