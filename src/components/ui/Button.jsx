export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}) {
  const variants = {
    primary:
      "bg-sky-500 hover:bg-sky-400 text-white border border-sky-400/20",

    secondary:
      "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700",

    success:
      "bg-emerald-500 hover:bg-emerald-400 text-white border border-emerald-400/20",

    danger:
      "bg-rose-500 hover:bg-rose-400 text-white border border-rose-400/20",

    ghost:
      "bg-transparent hover:bg-slate-800 text-slate-300 border border-transparent",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        whitespace-nowrap
        rounded-xl
        px-5
        h-11
        text-sm
        sm:text-base
        font-semibold
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-sky-400/50
        disabled:cursor-not-allowed
        disabled:opacity-50
        active:scale-[0.98]
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}