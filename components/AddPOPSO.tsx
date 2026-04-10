import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const AddPOPSO: React.FC = () => {
  const [branches, setBranches] = useState<string[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [poCount, setPoCount] = useState(12);
  const [psoCount, setPsoCount] = useState(3);
  const [poList, setPoList] = useState<string[]>(Array(12).fill(""));
  const [psoList, setPsoList] = useState<string[]>(Array(3).fill(""));
  const branch = localStorage.getItem("faculty_branch");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditable, setIsEditable] = useState(true);

  useEffect(() => {
    const textareas = document.querySelectorAll("textarea");

    textareas.forEach((ta: any) => {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    });
  }, [poList, psoList]);

  useEffect(() => {
    if (!selectedSession) return;

    fetch(
      `http://127.0.0.1:8000/api/get-po-pso/?session=${selectedSession}&branch=${branch}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.pos && data.pos.length > 0) {
          setPoList(data.pos);
          setPsoList(data.psos);
          setPoCount(data.pos.length);
          setPsoCount(data.psos.length);

          setIsEditMode(true);
          setIsEditable(false); // 

          toast.success("Existing data loaded");
        } else {
          // No data case
          setPoList(Array(12).fill(""));
          setPsoList(Array(3).fill(""));
          setPoCount(12);
          setPsoCount(3);

          setIsEditMode(false);
          setIsEditable(true); // 
        }
      });
  }, [selectedSession]);

  //  Fetch Branch & Session
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/sessions/")
      .then((res) => res.json())
      .then((data) => setSessions(data));
  }, []);

  //  Handle PO Change
  const handlePOChange = (index: number, value: string) => {
    const updated = [...poList];
    updated[index] = value;
    setPoList(updated);
  };

  //  Handle PSO Change
  const handlePSOChange = (index: number, value: string) => {
    const updated = [...psoList];
    updated[index] = value;
    setPsoList(updated);
  };

  //  Update Count
  const updatePOCount = (count: number) => {
    setPoCount(count);
    setPoList(Array(count).fill(""));
  };

  const updatePSOCount = (count: number) => {
    setPsoCount(count);
    setPsoList(Array(count).fill(""));
  };

  // Submit
  const handleSubmit = async () => {
    if (!selectedSession) {
      alert("Select session");
      return;
    }

    if (poList.some((po) => po.trim() === "")) {
      alert("Fill all PO fields");
      return;
    }

    if (psoList.some((pso) => pso.trim() === "")) {
      alert("Fill all PSO fields");
      return;
    }
    const response = await fetch("http://127.0.0.1:8000/api/save-po-pso/", {
      method: isEditMode ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session: selectedSession,
        pos: poList,
        psos: psoList,
        faculty_id: localStorage.getItem("faculty_id"),
      }),
    });

    if (response.ok) {
      toast.success(isEditMode ? "Updated successfully" : "Saved successfully");
    } else {
      toast.error("Error saving data");
    }
  };

  const handleReset = () => {
    setPoList(Array(poCount).fill(""));
    setPsoList(Array(psoCount).fill(""));
    setIsEditMode(false);
    toast("Form reset");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Toaster />

      {/*  HEADER */}
      <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
        PO/PSO Details Management
      </h1>

      <p className="text-center text-slate-600 mb-6">
        <strong>Branch:</strong> {branch}
      </p>

      <div className="max-w-4xl mx-auto">
        {/* ================= PO SECTION ================= */}
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          {/* Dropdowns */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Session
              </label>

              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Session</option>
                {sessions.map((s, i) => (
                  <option key={i}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-4 text-blue-600 flex items-center gap-2">
            PO Details
          </h2>

          {/* Edit Count */}
          <div className="mb-4 flex items-center gap-3">
            <label>No. of POs:</label>
            <input
              type="number"
              disabled={!isEditable}
              value={poCount}
              onChange={(e) => updatePOCount(Number(e.target.value))}
              className="border p-1 w-20"
            />
          </div>

          {/* PO Inputs */}
          {poList.map((po, index) => (
            <div key={index} className="flex items-center gap-3 mb-2">
              <span className="w-12 font-semibold text-slate-600">
                PO{index + 1}
              </span>

              <textarea
                value={po}
                disabled={!isEditable}
                onChange={(e) => {
                  handlePOChange(index, e.target.value);

                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                className="flex-1 border p-2 rounded resize-none overflow-hidden"
                rows={1}
              />
            </div>
          ))}
        </div>

        {/* ================= PSO SECTION ================= */}

        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600 flex items-center gap-2">
            PSO Details
          </h2>

          {/* Dropdowns */}

          {/* Edit Count */}
          <div className="mb-4 flex items-center gap-3">
            <label>No. of PSOs:</label>
            <input
              type="number"
              disabled={!isEditable}
              value={psoCount}
              onChange={(e) => updatePSOCount(Number(e.target.value))}
              className="border p-1 w-20"
            />
          </div>

          {/* PSO Inputs */}
          {psoList.map((pso, index) => (
            <div key={index} className="flex items-center gap-3 mb-2">
              <span className="w-16 font-semibold text-slate-600">
                PSO{index + 1}
              </span>
              <textarea
                value={pso}
                disabled={!isEditable}
                onChange={(e) => {
                  handlePSOChange(index, e.target.value);

                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                className="flex-1 border p-2 rounded resize-none overflow-hidden"
                rows={1}
              />
            </div>
          ))}
        </div>

        {isEditMode && !isEditable && (
          <div className="text-center mt-4">
            <button
              onClick={() => setIsEditable(true)}
              className="bg-yellow-500 text-white px-6 py-2 rounded-xl hover:bg-yellow-600"
            >
              Edit
            </button>
          </div>
        )}
        {/*  SUBMIT BUTTON */}
        <div className="text-center mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
          >
            {isEditMode ? "Update" : "Submit"}
          </button>

          <button
            onClick={handleReset}
            className="bg-white-400 text-black px-6 py-3 rounded-xl hover:bg-white-500 ml-4"
          >
            Reset
          </button>
        </div>
      </div>
    </div >
  );
};

export default AddPOPSO;
