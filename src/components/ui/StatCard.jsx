import Card from "./Card";

export default function StatCard({
  title,
  value,
  icon,
  accent = "text-sky-400",
  footer = "",
  className = "",
}) {
  return (
    <Card
      className={`
        p-6
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-slate-600
        ${className}
      `}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
          {title}
        </p>

        <div className="text-3xl">
          {icon}
        </div>
      </div>

      {/* Value */}
      <h2
        className={`
          text-2xl
          font-black
          leading-none
          break-words
          ${accent}
        `}
      >
        {value}
      </h2>

      {/* Footer */}
      {footer && (
        <p className="mt-6 text-base leading-relaxed text-slate-500">
          {footer}
        </p>
      )}
    </Card>
  );
}