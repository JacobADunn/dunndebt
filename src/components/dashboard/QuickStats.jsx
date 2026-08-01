import Card from "../ui/Card";
import useFinance from "../../hooks/useFinance";

export default function QuickStats() {
  const {
    totalDebt,
    totalBills,
    totalMinimumPayments,
    utilization,
  } = useFinance();

  const stats = [
    {
      label: "Total Debt",
      value: `$${totalDebt.toFixed(2)}`,
      color: "text-rose-400",
    },
    {
      label: "Monthly Bills",
      value: `$${totalBills.toFixed(2)}`,
      color: "text-sky-400",
    },
    {
      label: "Card Payments",
      value: `$${totalMinimumPayments.toFixed(2)}`,
      color: "text-amber-400",
    },
    {
      label: "Utilization",
      value: `${utilization}%`,
      color:
        utilization >= 80
          ? "text-rose-400"
          : utilization >= 50
          ? "text-amber-400"
          : "text-emerald-400",
    },
  ];

  return (
    <section className="space-y-6">

      <div>
        <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">
          Quick Stats
        </h2>

        <p className="mt-2 text-base text-slate-400 sm:text-lg">
          Your financial snapshot at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
              {stat.label}
            </p>

            <h3
              className={`mt-4 break-words text-3xl font-black sm:text-4xl ${stat.color}`}
            >
              {stat.value}
            </h3>
          </Card>
        ))}
      </div>

    </section>
  );
}