import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AddCOPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    batch: "",
    session: "",
    semester: "",
  });

  const handleChange = (e: ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log("Submitted Data:", formData);

    // TODO: Connect to backend API here

    alert("Course Outcome Added Successfully!");

    navigate("/subject-details", { state: formData });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-2 p-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          <span className="ml-2">Back to Dashboard</span>
        </button>
      </div>

      {/* Card */}
      <div className="flex justify-center">
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-2xl p-10">
          <h2 className="text-3xl font-bold mb-2">Course Outcome</h2>
          <p className="text-gray-500 mb-8">
            Enter the details below to create a new course outcome record.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Batch */}
            <div>
              <label className="block text-sm font-semibold mb-2">BATCH</label>
              <input
                type="text"
                name="batch"
                placeholder="e.g. 2024-2028"
                value={formData.batch}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Session */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                SESSION
              </label>
              <input
                type="text"
                name="session"
                placeholder="e.g. Summer 2024"
                value={formData.session}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                SEMESTER
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Submit Course Outcome
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
