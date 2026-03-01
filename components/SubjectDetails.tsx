import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface Subject {
  id: number;
  subject_code: string;
  subject_name: string;
}

export default function SubjectDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const coBasicData: any = location.state || {};

  const [formData, setFormData] = useState({
    subjectCode: "",
    subjectName: "",
    numberOfCO: "",
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);

  // ✅ FETCH SUBJECTS FILTERED BY BATCH, SESSION, SEMESTER, BRANCH
 useEffect(() => {
  console.log("CO BASIC DATA:", coBasicData);

  fetch("http://127.0.0.1:8000/api/get-subjects-for-co/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      branch: coBasicData.branch,
      semester: coBasicData.semester,
      batch: coBasicData.batch,
      session: coBasicData.session,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("SUBJECT DATA:", data);
      setSubjects(data.subjects || []);
    })
    .catch((err) => console.error(err));
}, []);

  const handleChange = (e: ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubjectSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const selectedSubject = subjects.find((s) => s.id === selectedId);

    setFormData({
      ...formData,
      subjectCode: selectedSubject?.subject_code || "",
      subjectName: selectedSubject?.subject_name || "",
    });
  };

  const handleSubmit = (e: FormEvent) => {
  e.preventDefault();

  const selectedSubject = subjects.find(
    (s) => s.subject_code === formData.subjectCode
  );

  navigate("/batch", {
    state: {
      numberOfCO: Number(formData.numberOfCO),
      branch: coBasicData.branch,
      batch: coBasicData.batch,
      semester: coBasicData.semester,
      session: coBasicData.session,
      subject_id: selectedSubject?.id, // VERY IMPORTANT
    },
  });
};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-black"
        >
          ← Back to CO Details
        </button>
      </div>

      <div className="flex justify-center">
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-2xl p-10">
          <h2 className="text-3xl font-bold mb-2">Subject Details</h2>
          <p className="text-gray-500 mb-8">
            Select the subject and specify the number of outcomes.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject Code Dropdown */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                SUBJECT CODE
              </label>
              <select
                onChange={handleSubjectSelect}
                required
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Subject Code</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject_code}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Name Auto Filled */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                SUBJECT NAME
              </label>
              <input
                type="text"
                value={formData.subjectName}
                readOnly
                className="w-full border rounded-lg px-4 py-3 bg-gray-100"
              />
            </div>

            {/* Number of CO */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                NUMBER OF COURSE OUTCOMES
              </label>
              <input
                type="number"
                name="numberOfCO"
                placeholder="e.g. 5"
                value={formData.numberOfCO}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
            >
              Complete Setup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}