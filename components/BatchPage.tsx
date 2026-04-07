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
  const { branch, batch, semester, session, subject_id } = location.state || {};

  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<any>({});
  const [coList, setCoList] = useState<any[]>([]);
  const [existingMarks, setExistingMarks] = useState<any>({});

  // ✅ Fetch Students (POST)
  useEffect(() => {
    if (!branch || !batch || !semester || !session) {
      console.log("Missing data:", { branch, batch, semester, session });
      return;
    }

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
      .then((data) => {
        console.log("Students:", data);
        setStudents(data.students);
      });
  }, [branch, batch, semester, session]);
  useEffect(() => {
    if (!subject_id || !branch) return;

    const fetchMarks = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/get-co-marks/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject_id,
            branch,
          }),
        });

        const data = await res.json();

        // 🔥 Convert to easy lookup
        const map: any = {};

        data.forEach((item: any) => {
          const key = `${item.reg_no}_CO${item.co_number}`;
          map[key] = item.marks;
        });

        setExistingMarks(map);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMarks();
  }, [subject_id, branch]);
  useEffect(() => {
    if (!subject_id) return;

    const fetchCO = async () => {
      try {
        const facultyId = localStorage.getItem("faculty_id");

        const res = await fetch(
          `http://127.0.0.1:8000/api/get-co-by-subject/?subject_id=${subject_id}&faculty_id=${facultyId}`,
        );

        const data = await res.json();

        console.log("CO LIST:", data);

        setCoList(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCO();
  }, [subject_id]);
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
    console.log("SUBMIT CLICKED");

    if (Object.keys(marks).length === 0) {
      alert("Please enter marks before submitting");
      return;
    }

    // 🔥 CONVERT MARKS OBJECT → ARRAY FORMAT
    const formattedMarks: any[] = [];

    Object.keys(marks).forEach((studentId) => {
      const coMarks = marks[studentId];

      Object.keys(coMarks).forEach((coKey) => {
        const coNumber = Number(coKey.replace("CO", ""));

        formattedMarks.push({
          student_id: Number(studentId),
          co_number: coNumber,
          marks: Number(coMarks[coKey]),
        });
      });
    });

    console.log("FORMATTED MARKS:", formattedMarks);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/save-co-marks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marks: formattedMarks, // ✅ FIXED FORMAT
          branch,
          batch,
          semester,
          session,
          subject_id,
        }),
      });

      const data = await response.json();

      console.log("RESPONSE DATA:", data);

      if (response.ok) {
        alert("Marks Saved Successfully!");
        navigate("/dashboard");
      } else {
        alert(data.error || "Error saving marks");
      }
    } catch (err) {
      console.error("ERROR:", err);
      alert("Server error");
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

              {coList.map((co) => (
                <th key={co.co_number} className="border px-4 py-2">
                  CO{co.co_number}
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

                {coList.map((co) => {
                  const key = `${student.registration_number}_CO${co.co_number}`;
                  const isFilled = existingMarks[key] && existingMarks[key] > 0;

                  return (
                    <td key={co.co_number} className="border px-4 py-2">
                      <input
                        type="number"
                        className={`border p-1 w-20 ${
                          isFilled ? "bg-gray-200 cursor-not-allowed" : ""
                        }`}
                        disabled={isFilled}
                        defaultValue={isFilled ? existingMarks[key] : ""}
                        onChange={(e) =>
                          handleChange(student.id, co.co_number, e.target.value)
                        }
                      />
                    </td>
                  );
                })}
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
