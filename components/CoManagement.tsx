import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
const CoManagement = () => {
  const navigate = useNavigate();

  const [coList, setCoList] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [coDetails, setCoDetails] = useState<any[]>([]);
  const [newCO, setNewCO] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSubjectCode, setSelectedSubjectCode] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // 🔷 FETCH SUBJECT CO SUMMARY
  useEffect(() => {
    const facultyId = localStorage.getItem("faculty_id");

    fetch(
      `http://127.0.0.1:8000/api/get-all-co-details/?faculty_id=${facultyId}`,
    )
      .then((res) => res.json()) // ✅ FIRST parse response
      .then((data) => setCoList(data)) // ✅ THEN use data
      .catch((err) => console.error(err));
  }, []);
  // 🔷 OPEN MODAL + FETCH CO
  const handleView = async (item: any) => {
    setShowModal(true);
    setSelectedSubject(item.subject_name);
    setSelectedSubjectCode(item.subject_code);
    setIsEditing(false);

    try {
      const facultyId = localStorage.getItem("faculty_id");

      console.log("CLICKED ITEM:", item); // 🔥 DEBUG

      const res = await fetch(
        `http://127.0.0.1:8000/api/get-co-by-subject/?subject_id=${item.subject_id}&faculty_id=${facultyId}`,
      );

      const data = await res.json();

      console.log("CO DATA:", data); // 🔥 DEBUG

      setCoDetails(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft size={18} />
          Go back to Dashboard
        </button>
      </div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">CO Management</h1>

        <button
          onClick={() => navigate("/add-co")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow"
        >
          + Add CO Details
        </button>
      </div>

      {/* GRID */}
      {coList.length === 0 ? (
        <div className="flex justify-center items-center h-[300px] bg-white rounded-xl shadow">
          <p>No CO data available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coList.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow">
              <h2 className="font-bold text-lg mb-2">{item.subject_name}</h2>

              <p>Branch: {item.branch}</p>
              <p>Semester: {item.semester}</p>
              <p>CO Count: {item.co_count}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleView(item)}
                  className="flex-1 bg-blue-500 text-white py-1 rounded"
                >
                  View
                </button>

                <button
                  className="flex-1 bg-green-600 text-white py-1 rounded"
                  onClick={() => {
                    const facultyId = localStorage.getItem("faculty_id");

                    window.open(
                      `http://127.0.0.1:8000/api/download-co-pdf/?branch=${item.branch}&semester=${item.semester}&subject_id=${item.subject_id}&faculty_id=${facultyId}`,
                    );
                  }}
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white w-[500px] p-6 rounded-xl shadow relative">
            {/* CLOSE */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-xl"
            >
              ×
            </button>

            <h2 className="text-xl font-bold mb-4">
              {selectedSubject} - CO Details
            </h2>

            {/* EDIT BUTTON */}
            <div className="flex justify-end mb-3">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-200 px-3 py-1 rounded"
              >
                Edit
              </button>
            </div>

            {/* ADD NEW CO */}
            {isEditing && (
              <div className="flex gap-2 mb-3">
                <input
                  value={newCO}
                  onChange={(e) => setNewCO(e.target.value)}
                  placeholder="New CO"
                  className="flex-1 border p-2 rounded"
                />

                <button
                  onClick={() => {
                    if (!newCO.trim()) return;

                    const newItem = {
                      id: Date.now(),
                      co_number: coDetails.length + 1,
                      co_description: newCO,
                      isNew: true,
                    };

                    setCoDetails([...coDetails, newItem]);
                    setNewCO("");
                  }}
                  className="bg-green-600 text-white px-3 rounded"
                >
                  Add
                </button>
              </div>
            )}

            {/* CO LIST */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {coDetails.map((co, index) => (
                <div key={co.id} className="border p-3 rounded relative">
                  {/* DELETE */}
                  {isEditing && (
                    <button
                      onClick={async () => {
                        if (!co.isNew) {
                          await fetch("http://127.0.0.1:8000/api/delete-co/", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              id: co.id,
                              faculty_id: localStorage.getItem("faculty_id"), // 🔥 ADD
                            }),
                          });
                        }

                        const updated = coDetails.filter((_, i) => i !== index);
                        setCoDetails(updated);
                      }}
                      className="absolute top-2 right-2 text-red-500"
                    >
                      ✕
                    </button>
                  )}

                  <p className="font-semibold">CO {index + 1}</p>

                  {isEditing ? (
                    <input
                      value={co.co_description}
                      onChange={(e) => {
                        const updated = [...coDetails];
                        updated[index].co_description = e.target.value;
                        setCoDetails(updated);
                      }}
                      className="w-full border p-2 rounded mt-1"
                    />
                  ) : (
                    <p>{co.co_description}</p>
                  )}
                </div>
              ))}
            </div>

            {/* SAVE */}
            {isEditing && (
              <button
                onClick={async () => {
                  try {
                    for (const co of coDetails) {
                      // NEW CO
                      if (co.isNew) {
                        await fetch(
                          "http://127.0.0.1:8000/api/add-co-single/",
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              subject_code: selectedSubjectCode,
                              co_number: co.co_number,
                              statement: co.co_description,
                              faculty_id: localStorage.getItem("faculty_id"), // 🔥 ADD THIS
                            }),
                          },
                        );
                      }

                      // UPDATE EXISTING
                      else {
                        await fetch("http://127.0.0.1:8000/api/update-co/", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            id: co.id,
                            statement: co.co_description,
                            faculty_id: localStorage.getItem("faculty_id"), // 🔥 ADD
                          }),
                        });
                      }
                    }

                    alert("Saved successfully");
                    setIsEditing(false);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoManagement;
