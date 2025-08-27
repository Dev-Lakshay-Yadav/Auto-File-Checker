import React, { useEffect, useState } from "react";

interface ApiResponseItem {
  success: boolean;
  file_Prefix: string;
  service_Type: string;
  tooth_Numbers: number[];
  additional_Notes: string;
  error: string[];
}

interface ApiResponse {
  JU: (ApiResponseItem | null)[];
}

const App = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:4000/cases/status");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json: ApiResponse = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) return <div>No data found</div>;

  // Filter records based on search term
  const filteredData = data.JU.filter(
    (item) =>
      item && item.file_Prefix.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 text-sm p-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Case Prefix..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
      />

      {/* Table Header */}
      <div className="flex gap-2 px-4 py-2 bg-gray-100 rounded-lg font-semibold">
        <div className="w-2/12">Case</div>
        <div className="w-2/12">Service Type</div>
        <div className="w-2/12">Tooth Numbers</div>
        <div className="w-3/12">Additional Notes</div>
        <div className="w-3/12">Status / Errors</div>
      </div>

      {/* Table Rows */}
      {filteredData.length > 0 ? (
        filteredData.map((item, index) => {
          if (!item) return null;
          return (
            <div
              key={index}
              className="flex w-full gap-2 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="w-2/12">{item.file_Prefix}</div>
              <div className="w-2/12">{item.service_Type}</div>
              <div className="w-2/12">{item.tooth_Numbers.join(", ")}</div>
              <div className="w-3/12">{item.additional_Notes}</div>
              <div className="w-3/12">
                {item.success ? (
                  <span className="text-green-600 font-bold">
                    All files present ✅
                  </span>
                ) : (
                  <ul className="list-disc list-inside text-red-600">
                    {item.error.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-gray-500">No matching records found.</div>
      )}
    </div>
  );
};

export default App;
