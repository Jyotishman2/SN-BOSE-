import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Short-Term Electricity Demand Forecasting and Anomaly Detection for the North-Eastern Region of India",
  description: "Short-Term Electricity Demand Forecasting and Anomaly Detection for the North-Eastern Region of India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <Sidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}

