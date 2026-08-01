export default function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-slate-800
        bg-slate-900/95
        p-5
        shadow-xl
        transition-all
        duration-200
        hover:border-slate-700
        hover:shadow-2xl
        sm:p-6
        lg:p-8
        ${className}
      `}
    >
      {children}
    </div>
  );
}