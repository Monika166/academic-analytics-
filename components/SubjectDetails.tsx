import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
interface Subject {
  code: string;
  name: string;
}

// 🔹 Temporary subject list (Later this will come from backend)

export default function SubjectDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const coBasicData = location.state as {
    batch: string;
    session: string;
    semester: string;
  };
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/subjects/?batch=${coBasicData.batch}&session=${coBasicData.session}&semester=${coBasicData.semester}`
        );

        const data = await response.json();

        if (response.ok) {
          setSubjects(data);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);


  const [formData, setFormData] = useState({
  numberOfCO: "",
});

  const handleChange = (e: ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  const facultyId = localStorage.getItem("faculty_id");

  if (!facultyId) {
    alert("Not logged in");
    return;
  }

  if (!selectedSubjectId) {
    alert("Please select subject");
    return;
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/add-co/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          faculty_id: facultyId,
          subject_id: selectedSubjectId,
          numberOfCO: formData.numberOfCO,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("Course Outcome Created Successfully");
      navigate("/dashboard");
    } else {
      alert(data.error || "Error saving CO");
    }
  } catch (error) {
    console.error(error);
    alert("Server error");
  }
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
            <div>
  <label className="block text-sm font-semibold mb-2">
    SUBJECT
  </label>

  <select
    value={selectedSubjectId}
    onChange={(e) => setSelectedSubjectId(e.target.value)}
    required
    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
  >
    <option value="">Select Subject</option>
    {subjects.map((subject) => (
      <option key={subject.id} value={subject.id}>
        {subject.subject_code} - {subject.subject_name}
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
      </div >
    </div >
  );
}
