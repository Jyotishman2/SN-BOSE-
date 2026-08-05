import type { UploadPrediction } from "@/types";

export default function AnomalyTable({ rows }: { rows: UploadPrediction[] }) {
 
  return (
    
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="max-h-[460px] overflow-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Datetime</th>
              <th className="px-4 py-3">Actual</th>
              <th className="px-4 py-3">Predicted</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.datetime}-${index}`} className={row.is_anomaly ? "bg-rose-50 text-rose-900" : "border-t border-slate-200 text-slate-700"}>
                <td className="px-4 py-3">{row.datetime}</td>
                <td className="px-4 py-3">{row.actual_demand_mw ?? "--"}</td>
                <td className="px-4 py-3">{row.predicted_demand_mw ?? "--"}</td>
                <td className="px-4 py-3">{row.anomaly_score ?? "--"}</td>
                <td className="px-4 py-3">{row.is_anomaly ? "Anomaly" : "Normal"}</td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={5}>Upload a CSV to review anomalies.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
