export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const styles = {
    primary: "bg-sky-500 hover:bg-sky-400 text-white",
    secondary:
      "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white",
    danger: "bg-rose-600 hover:bg-rose-500 text-white",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white",
    ghost: "hover:bg-slate-800 text-slate-300",
  };

  return (
    <button
      {...props}
      className={`rounded-2xl px-5 py-3 font-semibold transition-all duration-200 active:scale-95 ${
        styles[variant] || styles.primary
      } ${className}`}
    >
      {children}
    </button>
  );
}