import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const EditSubject: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const subject = location.state?.subject;

  const [formData, setFormData] = useState({
    subject_code: subject.subject_code,
    subject_name: subject.subject_name,
    semester: subject.semester,
    session: subject.session,
    batch: subject.batch,
    is_active: subject.is_active,
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const facultyId = localStorage.getItem("faculty_id");

    const response = await fetch(
      `http://127.0.0.1:8000/api/update-subject/${subject.id}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faculty_id: facultyId,
          ...formData,
        }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      alert("Subject updated successfully");
      navigate("/hod-dashboard");
    } else {
      alert(data.error || "Update failed");
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">Edit Subject</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="subject_code"
          value={formData.subject_code}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="subject_name"
          value={formData.subject_name}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="semester"
          type="number"
          value={formData.semester}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="session"
          value={formData.session}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="batch"
          value={formData.batch}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
          Active
        </label>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditSubject;
