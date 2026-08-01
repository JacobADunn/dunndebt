export default function Badge({ children, color = "slate" }) {
  const colors = {
    slate: "bg-slate-800 text-slate-300 border-slate-700",

    green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",

    red: "bg-rose-500/15 text-rose-300 border-rose-500/30",

    orange: "bg-orange-500/15 text-orange-300 border-orange-500/30",

    yellow: "bg-amber-500/15 text-amber-300 border-amber-500/30",

    blue: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${colors[color]}`}
    >
      {children}
    </span>
  );
}