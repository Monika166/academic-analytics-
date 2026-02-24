import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
interface Subject {
  code: string;
  name: string;
}

// 🔹 Temporary subject list (Later this will come from backend)
const subjects: Subject[] = [
  { code: "CS101", name: "Data Structures" },
  { code: "CS102", name: "Database Systems" },
  { code: "CS103", name: "Operating Systems" },
];

export default function SubjectDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const coBasicData = location.state as {
    batch: string;
    session: string;
    semester: string;
  };
  const [formData, setFormData] = useState({
    subjectCode: "",
    subjectName: "",
    numberOfCO: "",
  });

  const handleChange = (e: ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubjectCodeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const selectedSubject = subjects.find((sub) => sub.code === selectedCode);

    setFormData({
      ...formData,
      subjectCode: selectedCode,
      subjectName: selectedSubject ? selectedSubject.name : "",
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const fullCOData = {
      batch: coBasicData.batch,
      session: coBasicData.session,
      semester: coBasicData.semester,
      subjectCode: formData.subjectCode,
      subjectName: formData.subjectName,
      numberOfCO: formData.numberOfCO,
    };

    navigate("/dashboard", { state: fullCOData });
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
                name="subjectCode"
                value={formData.subjectCode}
                onChange={handleSubjectCodeChange}
                required
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Subject Code</option>
                {subjects.map((subject) => (
                  <option key={subject.code} value={subject.code}>
                    {subject.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Name Dropdown (Auto-filled but selectable) */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                SUBJECT NAME
              </label>
              <select
                name="subjectName"
                value={formData.subjectName}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Subject Name</option>
                {subjects.map((subject) => (
                  <option key={subject.name} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
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
