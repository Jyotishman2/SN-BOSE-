"use client";

import { useState } from "react";
import { Download, Loader2, UploadCloud } from "lucide-react";
import type { UploadPrediction } from "@/types";

export default function CSVUploader({ onUpload }: { onUpload: (file: File) => Promise<{ rows: UploadPrediction[] }> }) {
  const [rows, setRows] = useState<UploadPrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleFile(file?: File) {
    if (!file) return;
    setLoading(true);
    setMessage("");
    try {
      const result = await onUpload(file);
      setRows(result.rows);
      setMessage(`${result.rows.length} rows processed.`);
    } catch {
      setMessage("Upload failed. Check CSV columns and backend status.");
    } finally {
      setLoading(false);
    }
  }

  function downloadReport() {
    const csv = ["datetime,actual_demand_mw,predicted_demand_mw,anomaly_score,is_anomaly", ...rows.map((row) => [row.datetime, row.actual_demand_mw ?? "", row.predicted_demand_mw ?? "", row.anomaly_score ?? "", row.is_anomaly].join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "ner-anomaly-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="glass rounded-lg p-5">
      <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-500/60 bg-slate-950/40 p-6 text-center transition hover:border-teal-300/80">
        <input type="file" accept=".csv" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />
        {loading ? <Loader2 className="animate-spin text-teal-200" size={34} /> : <UploadCloud className="text-teal-200" size={34} />}
        <span className="mt-3 text-sm font-medium text-white">Upload CSV</span>
        <span className="mt-1 text-xs text-slate-400">Requires datetime, demand, weather, and holiday columns</span>
      </label>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-300">{message || "No file processed yet."}</p>
        <button onClick={downloadReport} disabled={!rows.length} className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm text-white disabled:opacity-40">
          <Download size={15} />
          Download report
        </button>
      </div>
    </div>
  );
}

