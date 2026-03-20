import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface Student {
  id: number;
  full_name: string;
  registration_number: string;
}

export default function BatchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { numberOfCO, branch, batch, semester, session, subject_id } =
    location.state || {};

  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<any>({});

  // ✅ Fetch Students (POST)
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get-students/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        branch,
        batch,
        semester,
        session,
      }),
    })
      .then((res) => res.json())
      .then((data) => setStudents(data.students));
  }, []);

  // Handle input change
  const handleChange = (studentId: number, coNumber: number, value: string) => {
    setMarks((prev: any) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [`CO${coNumber}`]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(marks).length === 0) {
      alert("Please enter marks before submitting");
      return;
    }

    // ✅ STEP 1: CREATE CO
    const coResponse = await fetch("http://127.0.0.1:8000/api/add-co/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        faculty_id: localStorage.getItem("faculty_id"),
        subject_id,
        branch,
        batch,
        semester,
        session,
      }),
    });

    const coData = await coResponse.json();

    // ❌ STOP IF ERROR
    if (!coResponse.ok) {
      alert(coData.error || "Error creating Course Outcome");
      return; // 🔥 VERY IMPORTANT
    }

    // ✅ STEP 2: SAVE MARKS
    const response = await fetch("http://127.0.0.1:8000/api/save-co-marks/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        marks,
        branch,
        batch,
        semester,
        session,
        subject_id,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Marks Saved Successfully!");
      navigate("/dashboard");
    } else {
      alert(data.error || "Error saving marks");
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">Batch CO Marks</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Student Name</th>
              <th className="border px-4 py-2">Registration Number</th>

              {Array.from({ length: numberOfCO }, (_, i) => (
                <th key={i} className="border px-4 py-2">
                  CO{i + 1}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="border px-4 py-2">{student.full_name}</td>
                <td className="border px-4 py-2">
                  {student.registration_number}
                </td>

                {Array.from({ length: numberOfCO }, (_, i) => (
                  <td key={i} className="border px-4 py-2">
                    <input
                      type="number"
                      className="border p-1 w-20"
                      onChange={(e) =>
                        handleChange(student.id, i + 1, e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
}
