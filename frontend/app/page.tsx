import EnergyFlowAnimation from "@/components/EnergyFlowAnimation";
import HeroSection from "@/components/HeroSection";
import MetricCard from "@/components/MetricCard";

export default function Home() {
  return (
    <div className="space-y-5">
      <EnergyFlowAnimation />
      <HeroSection />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Model" value="LightGBM" sub="Notebook feature parity" tone="teal" />
        <MetricCard label="Forecast" value="24h" sub="Iterative horizon" tone="sky" />
        <MetricCard label="Anomalies" value="various" sub="SuddenLoadSpike,FestiveChange etc" tone="amber" />
        <MetricCard label="Upload" value="CSV" sub="Batch scoring and anomaly review" tone="rose" />
      </div>
    </div>
  );
}
