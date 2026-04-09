import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const COPOPSOMapping = () => {
  const location = useLocation();

  const { subject_id, branch, session } = location.state || {};

  const [coList, setCoList] = useState([]);
  const [poList, setPoList] = useState([]);
  const [psoList, setPsoList] = useState([]);

  const [mapping, setMapping] = useState<
    Array<{ co: number; po: Record<string, number>; pso: Record<string, number> }>
  >([]);

  // 🔹 Fetch CO + PO + PSO automatically
  useEffect(() => {
    if (subject_id) {
      fetch(`http://127.0.0.1:8000/api/get-mapping-data/?subject_id=${subject_id}`)
        .then((res) => res.json())
        .then((data) => {
          setCoList(data.cos);
          setPoList(data.pos);
          setPsoList(data.psos);

          const temp = data.cos.map((co: any, i: number) => ({
            co: co.id,
            po: Object.fromEntries(
              data.pos.map((_: any, j: number) => [`PO${j + 1}`, 0])
            ),
            pso: Object.fromEntries(
              data.psos.map((_: any, j: number) => [`PSO${j + 1}`, 0])
            ),
          }));

          setMapping(temp);
        });
    }
  }, [subject_id]);

  // 🔹 Handle change
  const handleChange = (coIndex: number, type: "po" | "pso", key: string, value: any) => {
    const updated = [...mapping];
    updated[coIndex][type][key] = Number(value);
    setMapping(updated);
  };

  // 🔹 Submit
  const handleSubmit = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/save-co-po-pso/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject_id: subject_id,
        mappings: mapping,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Mapping saved successfully!");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="p-6">

      {/*  CENTERED HEADING */}
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-4">
        CO-PO-PSO Mapping
      </h1>

      {/*  Branch & Session */}
      <div className="text-center mb-6">
        <p className="text-lg"><strong>Branch:</strong> {branch}</p>
        <p className="text-lg"><strong>Session:</strong> {session}</p>
      </div>

      {/*  Matrix */}
      {coList.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-blue-600 text-center">
            CO-PO-PSO Mapping Matrix
          </h2>
          <p className="text-sm text-gray-500 text-center mb-4">
            (Articulation Matrix)
          </p>
          <p className="text-sm text-gray-600  mb-2">
            Correlation Levels: 0 - No Correlation, 1 - Lowest, 2 - Moderate, 3 - Highest
          </p>

          <div className="overflow-auto">
            <table className="w-full border border-gray-300 text-center">

              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">CO</th>

                  {poList.map((_: any, i: number) => (
                    <th key={i} className="border p-2">PO{i + 1}</th>
                  ))}

                  {psoList.map((_: any, i: number) => (
                    <th key={i} className="border p-2">PSO{i + 1}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {coList.map((co: any, i: number) => (
                  <tr key={i}>
                    <td className="border p-2 text-left">
                      <div className="font-semibold">CO{i + 1}</div>
                      <div className="text-xs text-gray-500">{co.text}</div>
                    </td>

                    {/* PO */}
                    {poList.map((_: any, j: number) => (
                      <td key={j} className="border">
                        <select
                          value={mapping[i]?.po[`PO${j + 1}`]}
                          onChange={(e) =>
                            handleChange(i, "po", `PO${j + 1}`, e.target.value)
                          }
                        >
                          {[0, 1, 2, 3].map((v) => (
                            <option key={v}>{v}</option>
                          ))}
                        </select>
                      </td>
                    ))}

                    {/* PSO */}
                    {psoList.map((_: any, j: number) => (
                      <td key={j} className="border">
                        <select
                          value={mapping[i]?.pso[`PSO${j + 1}`]}
                          onChange={(e) =>
                            handleChange(i, "pso", `PSO${j + 1}`, e.target.value)
                          }
                        >
                          {[0, 1, 2, 3].map((v) => (
                            <option key={v}>{v}</option>
                          ))}
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* 🔘 Submit */}
          <div className="mt-6 text-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Submit Mapping
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default COPOPSOMapping;