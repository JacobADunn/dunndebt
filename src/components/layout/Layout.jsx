export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background Accent */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* App Content */}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}