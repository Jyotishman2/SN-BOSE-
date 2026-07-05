import type { UploadPrediction } from "@/types";

export default function AnomalyTable({ rows }: { rows: UploadPrediction[] }) {
 
  return (
    
    <div className="glass overflow-hidden rounded-lg">
      <div className="max-h-[460px] overflow-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="sticky top-0 bg-slate-950/90 text-xs uppercase tracking-[0.14em] text-slate-400">
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
              <tr key={`${row.datetime}-${index}`} className={row.is_anomaly ? "bg-rose-500/10 text-rose-100" : "border-t border-white/10 text-slate-200"}>
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
