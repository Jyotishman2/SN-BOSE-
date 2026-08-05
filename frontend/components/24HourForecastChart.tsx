"use client";

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from "recharts";

// Dummy data generation to visualize the transition from actuals to forecast
const generateData = () => {
  const data = [];
  const now = new Date();
  const nowHour = now.getHours();
  
  for (let i = -24; i <= 24; i++) {
    const time = new Date(now);
    time.setHours(nowHour + i, 0, 0, 0);
    
    const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isPast = i <= 0;
    
    // Base demand pattern simulating daily cyclicity
    const baseDemand = 1800 + Math.sin(time.getHours() / 3.8) * 200;
    
    if (isPast) {
      data.push({
        time: timeStr,
        actual: Math.round(baseDemand + (Math.random() * 40 - 20)),
        forecast: null,
        confidence: null,
      });
    } else {
      const forecastVal = Math.round(baseDemand);
      data.push({
        time: timeStr,
        actual: null,
        forecast: forecastVal,
        // Using an array [low, high] for the area range
        confidence: [forecastVal - 50 - (i * 2), forecastVal + 50 + (i * 2)],
      });
    }
  }
  
  // Connect the boundary point so the line is continuous
  const currentIdx = data.findIndex((d) => d.forecast !== null);
  if (currentIdx > 0 && currentIdx < data.length) {
      data[currentIdx - 1].forecast = data[currentIdx - 1].actual;
      data[currentIdx - 1].confidence = [data[currentIdx - 1].actual, data[currentIdx - 1].actual];
  }

  return { data, boundaryTime: data[24].time };
};

const { data: mockData, boundaryTime } = generateData();

export default function Forecast24Chart() {
  return (
    <div className="col-span-full h-[450px] rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">24-Hour Forecast & Confidence</h3>
        <p className="text-sm text-slate-500">Historical vs Predicted Demand Boundary</p>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="time" 
            stroke="#64748b" 
            tickLine={false} 
            axisLine={false} 
            minTickGap={30}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#64748b" 
            tickLine={false} 
            axisLine={false} 
            width={60} 
            tick={{ fontSize: 12 }}
            domain={['auto', 'auto']}
            tickFormatter={(value) => `${value} MW`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
          
          <ReferenceLine 
             x={boundaryTime} 
             stroke="#94a3b8" 
             strokeDasharray="3 3" 
             label={{ position: 'top', value: 'Now', fill: '#64748b', fontSize: 12 }} 
          />

          <Area 
            type="monotone" 
            dataKey="confidence" 
            stroke="none" 
            fill="#818cf8" 
            fillOpacity={0.2}
            name="95% Confidence Interval"
          />
          
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#0f172a" 
            strokeWidth={2} 
            dot={false} 
            name="Actual Demand" 
          />
          <Line 
            type="monotone" 
            dataKey="forecast" 
            stroke="#818cf8" 
            strokeWidth={2} 
            strokeDasharray="5 5"
            dot={false} 
            name="Forecasted Demand" 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
