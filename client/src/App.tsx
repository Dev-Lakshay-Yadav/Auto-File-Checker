import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";

interface ApiResponseItem {
  success: boolean;
  file_Prefix: string;
  service_Type: string;
  tooth_Numbers: number[];
  additional_Notes: string;
  error: string[];
}

interface ApiResponse {
  [key: string]: (ApiResponseItem | null)[];
}

const App = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:4000/cases/status`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json: ApiResponse = await res.json();
        setData(json);

        // Set the first key as default active
        const firstKey = Object.keys(json)[0] || null;
        setActiveKey(firstKey);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return <div className="p-6">No data found</div>;

  const keys = Object.keys(data);

  return (
    <div className="w-full h-full">
      {/* Buttons */}
      <div className="w-full flex gap-4 p-4 items-center justify-center">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => setActiveKey(key)}
            className={`cursor-pointer px-4 rounded ${
              activeKey === key
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      <div className="p-4">
        {activeKey && <Dashboard data={data[activeKey]} />}
      </div>
    </div>
  );
};

export default App;
