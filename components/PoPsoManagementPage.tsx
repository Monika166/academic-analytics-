import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
export default function PoPsoManagement() {
  const navigate = useNavigate();
  const [session, setSession] = useState("");
  const [sessions, setSessions] = useState<string[]>([]);
  const [mappings, setMappings] = useState<any[]>([]);
  const handleDownload = (item: any) => {
    const branch = localStorage.getItem("faculty_branch");

    const url = `http://127.0.0.1:8000/api/download-mapping-excel/?branch=${branch}&session=${item.session}&subject_id=${item.subject_id}&subject=${encodeURIComponent(item.subject_name)}`;

    window.open(url, "_blank");
  };
  const [showModal, setShowModal] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<any>(null);
  const handleView = async (item: any) => {
    try {
      // 1️⃣ Get structure (CO, PO, PSO)
      const res = await axios.get(
        `http://127.0.0.1:8000/api/get-mapping-data/?subject_id=${item.subject_id}`,
      );

      // 2️⃣ Get actual mappings
      const saved = await axios.get(
        `http://127.0.0.1:8000/api/get-saved-mapping/?subject_id=${item.subject_id}`,
      );

      // 3️⃣ Convert saved mapping into lookup
      const mappingLookup: any = {};

      saved.data.forEach((m: any) => {
        mappingLookup[m.co] = {
          po: m.po,
          pso: m.pso,
        };
      });

      setSelectedMapping({
        ...item,
        cos: res.data.cos,
        pos: res.data.pos,
        psos: res.data.psos,
        mappingLookup,
      });

      setShowModal(true);
    } catch (err) {
      console.error("Error fetching mapping", err);
    }
  };
  useEffect(() => {
    fetchMappings();
  }, []);

  const fetchMappings = async () => {
    try {
      const session = localStorage.getItem("session"); // or selected session
      const branch = localStorage.getItem("faculty_branch");

      const res = await axios.get(
        `http://127.0.0.1:8000/api/get-mapping-principal/?branch=${branch}`,
      );

      setMappings(res.data);
    } catch (err) {
      console.error("Error fetching mappings", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center mb-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white shadow hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-semibold text-blue-600">
          PO / PSO Management
        </h1>
      </div>
      {/* TOP HEADER ROW */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-700">
          Manage Program Outcomes (PO) & Program Specific Outcomes (PSO)
        </h2>

        <button
          onClick={() => navigate("/add-po-pso")}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span className="text-lg font-bold">+</span>
          Add PO-PSO
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-6">
        

        

        {/* Placeholder Section */}
        {mappings.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center">
            <p className="text-gray-500 text-sm">
              No PO/PSO mappings available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mappings.map((item: any, index: number) => (
              <div
                key={index}
                className="bg-white border rounded-2xl shadow p-5 hover:shadow-md transition"
              >
                {/* Top */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                    SEM {item.semester}
                  </span>
                  <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
                    ACTIVE
                  </span>
                </div>

                {/* Subject */}
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.subject_name}
                </h3>

                {/* Details */}
                <div className="text-sm text-gray-500 mt-2">
                  <p>Session: {item.session}</p>
                  <p>Batch: {item.batch}</p>
                  <p>Faculty: {item.faculty_name}</p>
                </div>

                {/* Actions */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleView(item)}
                    className="text-blue-600 text-sm font-medium"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDownload(item)}
                    className="text-blue-600 text-sm font-medium"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showModal && selectedMapping && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-[95%] max-w-6xl p-6 overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-blue-600">
                  {selectedMapping.subject_name}
                </h2>
                <p className="text-sm text-gray-500">
                  Session: {selectedMapping.session} | Batch:{" "}
                  {selectedMapping.batch}
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <span>3 - Strong</span>
              </div>
              <div className="flex items-center gap-2">
                <span>2 - Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <span>1 - Low</span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border text-sm text-center">
                {/* Header */}
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">CO</th>

                    {/* Dynamic PO */}
                    {(selectedMapping.pos || []).map((po: any) => (
                      <th key={po.code} className="border p-2">
                        {po.code}
                      </th>
                    ))}

                    {/* Dynamic PSO */}
                    {(selectedMapping.psos || []).map((pso: any) => (
                      <th key={pso.code} className="border p-2">
                        {pso.code}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {(selectedMapping.cos || []).map((co: any) => {
                    const mapping =
                      selectedMapping.mappingLookup?.[co.id] || {};

                    return (
                      <tr key={co.id}>
                        {/* CO */}
                        <td className="border p-2 font-semibold bg-gray-50">
                          CO{co.co_number}
                        </td>

                        {/* Dynamic PO Values */}
                        {(selectedMapping.pos || []).map((po: any) => {
                          const value = mapping.po?.[po.code];

                          return (
                            <td
                              key={po.code}
                              className="border p-2 font-medium text-gray-700"
                            >
                              {value ?? "-"}
                            </td>
                          );
                        })}

                        {/* Dynamic PSO Values */}
                        {(selectedMapping.psos || []).map((pso: any) => {
                          const value = mapping.pso?.[pso.code];

                          return (
                            <td
                              key={pso.code}
                              className="border p-2 font-medium text-gray-700"
                            >
                              {value ?? "-"}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
