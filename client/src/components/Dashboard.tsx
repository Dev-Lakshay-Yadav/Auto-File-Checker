interface ApiResponseItem {
  success: boolean;
  file_Prefix: string;
  service_Type: string;
  tooth_Numbers: number[];
  additional_Notes: string;
  error: string[];
}

interface DashboardProps {
  caseType: string;
  data: (ApiResponseItem | null)[];
}

const Dashboard = ({ caseType, data }: DashboardProps) => {
  return (
    <div className="flex flex-col text-sm w-full rounded-xl overflow-hidden">
      {data.length > 0 ? (
        <>
          {/* Table Header */}
          <div className="flex gap-2 px-4 py-2 bg-gray-900 text-white font-semibold">
            <div className="w-2/12">Case</div>
            <div className="w-2/12">Service Type</div>
            <div className="w-2/12">Tooth Numbers</div>
            <div className="w-3/12">Additional Notes</div>
            <div className="w-3/12">Status / Errors</div>
          </div>

          {/* Table Rows */}
          {data.map(
            (item, index) =>
              item && (
                <div
                  key={index}
                  className={`flex w-full gap-2 px-4 py-3 ${
                    item.success ? `bg-gray-300` : `bg-gray-100`
                  } `}
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
              )
          )}
        </>
      ) : (
        <div className="text-gray-500">No records found.</div>
      )}
    </div>
  );
};

export default Dashboard;
