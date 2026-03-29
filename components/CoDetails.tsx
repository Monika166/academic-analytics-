import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function CoDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state;

  // 🔴 Safety check
  if (!state) {
    return (
      <div className="p-6">
        <h2 className="text-red-600 font-bold">
          No data received. Go back and try again.
        </h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const { subject_id, subjectCode, subjectName, numCO } = state;

  const [coList, setCoList] = useState<string[]>([]);

  // Generate CO inputs
  useEffect(() => {
    if (numCO) {
      setCoList(Array.from({ length: Number(numCO) }, () => ""));
    }
  }, [numCO]);

  const handleChange = (index: number, value: string) => {
    const updated = [...coList];
    updated[index] = value;
    setCoList(updated);
  };

  const handleSubmit = async () => {
    if (!subject_id) {
      alert("Subject missing");
      return;
    }

    if (coList.some((co) => !co.trim())) {
      alert("Fill all CO statements");
      return;
    }

    const facultyId = localStorage.getItem("faculty_id");

    if (!facultyId) {
      alert("User not logged in properly");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/save-co-details/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject_id,
          co_statements: coList,
          faculty_id: facultyId, // 🔥 FIX
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || data.message || "Error saving");
        return;
      }

      alert("CO Details saved successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600">
        ← Back
      </button>

      <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Course Outcome Statements</h2>

        <p>
          <strong>Subject Code:</strong> {subjectCode}
        </p>
        <p>
          <strong>Subject Name:</strong> {subjectName}
        </p>

        <div className="mt-6 space-y-4">
          {coList.map((co, index) => (
            <div key={index}>
              <label className="font-semibold">CO{index + 1}</label>
              <textarea
                value={co}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-full border p-2 rounded mt-1"
                placeholder={`Enter CO${index + 1}`}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
