import { BrainCircuit, CalendarClock, CloudSun, Code2, Database, LineChart, ServerCog, Target, Users, Workflow } from "lucide-react";

const highlights = [
  {
    title: "Project Goal",
    text: "Forecast hourly electricity demand for the North-Eastern Region of India so operators can plan supply, monitor demand patterns, and react earlier to unusual load behavior.",
    icon: Target,
  },
  {
    title: "Data Signals",
    text: "The app combines demand history with temperature, humidity, feels-like weather values, holidays, calendar features, lag features, and rolling statistics.",
    icon: Database,
  },
  {
    title: "Forecast Flow",
    text: "Users can view dashboard trends, generate a 24-hour forecast, upload CSV files for batch prediction, and inspect anomaly results from the same interface.",
    icon: CalendarClock,
  },
];

const modelDetails = [
  { label: "Core Model", value: "LightGBM Regressor", icon: BrainCircuit },
  { label: "Forecast Horizon", value: "24 hours", icon: LineChart },
  { label: "External Inputs", value: "Weather and holidays", icon: CloudSun },
  { label: "Training Source", value: "model.ipynb + CSV dataset", icon: Database },
];

const techStacks = [
  {
    title: "Frontend",
    icon: Code2,
    items: ["Next.js ", "React ", "TypeScript", "Tailwind CSS", "Framer Motion", "Axios","Shadcn UI"],
  },
  {
    title: "Backend API",
    icon: ServerCog,
    items: ["FastAPI", "Uvicorn", "Pydantic" ,"OpenWeather API "],
  },
  {
    title: "ML & Data",
    icon: BrainCircuit,
    items: ["Python", "Pandas", "NumPy", "LightGBM", "scikit-learn","Matplotlib",
"Seaborn", "Isolation Forest", "Optuna", "Joblib"],
  },
  {
    title: "Deployment & DevOps",
    icon: Workflow,
    items: ["Git","GitHub","Vercel","Render"]
  },
];

const teamMembers = [
  { name: "Monjit Tamuli", role: "SchID : 2313031", photo: "/team/member-1.svg" },
  { name: "Aninda Sundar Borah", role: "SchID : 2313045", photo: "/team/member-2.svg" },
  { name: "Maharnav Sarma", role: "SChID : 2313056", photo: "/team/member-3.svg" },
  { name: "Jyotishman Parashar", role: "SchID : 2313076", photo: "/team/member-4.svg" },
  { name: "Abhinav Bora", role: "SchID  : 2313079", photo: "/team/member-5.svg" },
  { name: "Nibir Nilav Bora", role : "SchID : 2313115", photo: "/team/member-6.svg" },
];

export default function DescriptionPage() {
  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.25fr_0.75fr] lg:p-7">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-teal-600">Project Description</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-semibold text-slate-900">Short-Term Electricity Demand Forecasting and Anomaly Detection for the North-Eastern Region of India</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
              This project is a full-stack short-term electricity demand forecasting and anomaly detection system for the North-Eastern Region of India. It connects a FastAPI prediction service with a Next.js dashboard so demand trends, short-term forecasts, CSV uploads, and anomaly reviews are available in one operational workspace.
            </p>
          </div>
          <div className="rounded-lg border border-teal-200 bg-teal-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-600 text-slate-900">
                <Users size={22} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Team Size</p>
                <p className="text-2xl font-semibold text-slate-900">6 Members</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Guided by <span className="font-medium text-slate-900">Dr. Nabanita Adhikary</span>, the team covers data preparation, model training,
              backend APIs, frontend design, testing, and deployment.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
              <Icon className="text-teal-600" size={24} />
              <h2 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-teal-600">Tech Stack</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Technologies Used</h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {techStacks.map((stack) => {
            const Icon = stack.icon;
            return (
              <article key={stack.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <Icon className="text-amber-600" size={20} />
                  <h3 className="text-base font-semibold text-slate-900">{stack.title}</h3>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stack.items.map((item) => (
                    <span key={item} className="rounded-md border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-teal-600">Model Details</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Forecasting Model</h2>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {modelDetails.map((detail) => {
            const Icon = detail.icon;
            return (
              <div key={detail.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <Icon className="text-amber-600" size={20} />
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{detail.label}</p>
                </div>
                <p className="mt-3 text-lg font-semibold text-slate-900">{detail.value}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-600">
          The model uses notebook-matched feature engineering and a saved LightGBM artifact for production predictions. When the model
          artifact is missing, the backend can bootstrap training from the included regional demand dataset.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-teal-600">People</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Team Members</h2>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {teamMembers.map((member) => (
            <article key={member.name} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <img
                src={member.photo}
                alt={`${member.name} photo`}
                className="h-16 w-16 shrink-0 rounded-lg border border-slate-200 object-cover"
              />
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-slate-900">{member.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
        <p className="text-sm uppercase tracking-[0.18em] text-teal-600">Mentor</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Dr. Nabanita Adhikary</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Project mentor and guide for model direction, evaluation review, and final project presentation.
        </p>
      </section>
    </div>
  );
}

