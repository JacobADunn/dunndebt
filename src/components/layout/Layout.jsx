export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Page Header */}

      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-8 py-8">

          <h1 className="text-5xl font-black tracking-tight">
            💰 Command Center
          </h1>

          <p className="mt-2 text-lg text-slate-400">
            Personal Finance Dashboard
          </p>

        </div>
      </header>

      {/* Main Content */}

      <main className="mx-auto max-w-7xl px-8 py-10">
        {children}
      </main>

    </div>
  );
}