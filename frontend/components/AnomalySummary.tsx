import type { UploadPrediction } from "@/types";

const possibleCauses = ["Sudden weather change", "Festival load spike", "Industrial load increase"];

function formatTime(datetime: string) {
  const parsed = new Date(datetime);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  }

  const match = datetime.match(/\b\d{1,2}:\d{2}\b/);
  return match?.[0] ?? datetime;
}

function formatDemand(row: UploadPrediction) {
  const demand = row.actual_demand_mw ?? row.predicted_demand_mw;

  if (typeof demand !== "number") {
    return "--";
  }

  return `${Math.round(demand)} MW`;
}

function severityForScore(score?: number) {
  if (typeof score !== "number") {
    return { label: "Medium", marker: "\u{1F7E1}", className: "text-amber-600" };
  }

  if (score <= -0.3) {
    return { label: "High", marker: "\u{1F534}", className: "text-rose-600" };
  }

  if (score <= -0.1) {
    return { label: "Medium", marker: "\u{1F7E1}", className: "text-amber-600" };
  }

  return { label: "Low", marker: "\u{1F7E2}", className: "text-emerald-600" };
}

export default function AnomalySummary({ rows }: { rows: UploadPrediction[] }) {
  const anomalies = rows.filter((row) => row.is_anomaly);
  const averageScore =
    anomalies.length > 0
      ? anomalies.reduce((total, row) => total + (row.anomaly_score ?? 0), 0) / anomalies.length
      : null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-teal-600">Anomaly Review</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Detected Events</h2>
        </div>
        <p className="text-sm text-slate-500">{anomalies.length ? `${anomalies.length} flagged rows` : "No flagged rows yet"}</p>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.14em] text-slate-500">
            <tr className="border-b border-slate-200">
              <th className="pb-3 pr-4">Time</th>
              <th className="pb-3 pr-4">Demand</th>
              <th className="pb-3">Severity</th>
            </tr>
          </thead>
          <tbody>
            {anomalies.slice(0, 5).map((row, index) => {
              const severity = severityForScore(row.anomaly_score);

              return (
                <tr key={`${row.datetime}-${index}`} className="border-b border-slate-200 last:border-0">
                  <td className="py-3 pr-4 text-slate-700">{formatTime(row.datetime)}</td>
                  <td className="py-3 pr-4 font-medium text-slate-900">{formatDemand(row)}</td>
                  <td className={`py-3 font-medium ${severity.className}`}>
                    {severity.marker} {severity.label}
                  </td>
                </tr>
              );
            })}
            {!anomalies.length ? (
              <tr>
                <td className="py-6 text-center text-slate-500" colSpan={3}>
                  Upload a CSV to see anomaly time, demand, and severity.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Anomaly Score</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{averageScore === null ? "--" : averageScore.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Possible Causes</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {possibleCauses.map((cause) => (
              <li key={cause}>{"\u2022"} {cause}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
