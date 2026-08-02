import useFinance from "../../hooks/useFinance";

export default function QuickStats() {
  const {
    cashFlow,
    cards,
    totalDebt,
    totalBills,
    totalMinimumPayments,
    utilization,
  } = useFinance();

  const monthlyIncome =
    Number(cashFlow.weeklyPaycheck || 0) * 4;

  const monthlyOut =
    totalBills + totalMinimumPayments;

  const attackPower =
    monthlyIncome - monthlyOut;

  const formatMoney = (value) =>
    `$${Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  function Stat({
    label,
    value,
    color = "text-white",
  }) {
    return (
      <div className="flex items-center py-1.5">

        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 whitespace-nowrap">
          {label}
        </span>

        <div className="mx-3 flex-1 border-b border-dashed border-slate-700" />

        <span
          className={`font-mono text-[1rem] font-semibold whitespace-nowrap ${color}`}
        >
          {value}
        </span>

      </div>
    );
  }

  const utilizationColor =
    utilization >= 90
      ? "text-rose-400"
      : utilization >= 70
      ? "text-amber-400"
      : "text-emerald-400";

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8">

      <div className="mb-8">

        <h2 className="text-3xl font-black">
          Financial Snapshot
        </h2>

        <p className="mt-2 text-slate-400">
          Live household financial overview
        </p>

      </div>

      <div className="grid gap-12 lg:grid-cols-3">

        {/* CASH FLOW */}

        <div>

          <h3 className="mb-5 font-mono text-sm font-bold uppercase tracking-[0.3em] text-slate-300">
            Cash Flow
          </h3>

          <Stat
            label="Checking"
            value={formatMoney(
              cashFlow.checkingBalance
            )}
          />

          <Stat
            label="Available"
            value={formatMoney(attackPower)}
            color={
              attackPower >= 0
                ? "text-emerald-400"
                : "text-rose-400"
            }
          />

          <Stat
            label="Next Payday"
            value={
              cashFlow.nextPayday || "--"
            }
            color="text-sky-400"
          />

          <Stat
            label="Schedule"
            value={
              cashFlow.payFrequency ||
              "Weekly"
            }
          />

        </div>

        {/* MONTHLY */}

        <div>

          <h3 className="mb-5 font-mono text-sm font-bold uppercase tracking-[0.3em] text-slate-300">
            Monthly
          </h3>

          <Stat
            label="Income"
            value={formatMoney(monthlyIncome)}
            color="text-sky-400"
          />

          <Stat
            label="Bills"
            value={formatMoney(totalBills)}
            color="text-amber-400"
          />

          <Stat
            label="Cards"
            value={formatMoney(
              totalMinimumPayments
            )}
            color="text-amber-400"
          />

          <Stat
            label="Required Out"
            value={formatMoney(monthlyOut)}
            color="text-rose-400"
          />

        </div>

        {/* DEBT */}

        <div>

          <h3 className="mb-5 font-mono text-sm font-bold uppercase tracking-[0.3em] text-slate-300">
            Debt
          </h3>

          <Stat
            label="Total Debt"
            value={formatMoney(totalDebt)}
            color="text-rose-400"
          />

          <Stat
            label="Utilization"
            value={`${utilization}%`}
            color={utilizationColor}
          />

          <Stat
            label="Minimums"
            value={formatMoney(
              totalMinimumPayments
            )}
          />

          <Stat
            label="Accounts"
            value={cards.length}
          />

        </div>

      </div>

    </section>
  );
}