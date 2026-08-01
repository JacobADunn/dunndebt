import SummaryCard from "./SummaryCard";
import useFinance from "../../hooks/useFinance";
import { formatCurrency } from "../../utils/formatters";

export default function QuickStats() {
  const {
    totalDebt,
    totalBills,
    totalMinimumPayments,
    totalCreditLimit,
    utilization,
  } = useFinance();

  const stats = [
    {
      title: "Total Debt",
      value: formatCurrency(totalDebt),
      icon: "💳",
      accent: "text-rose-400",
      footer: "Across all credit cards",
    },
    {
      title: "Monthly Bills",
      value: formatCurrency(totalBills),
      icon: "🏠",
      accent: "text-sky-400",
      footer: "Recurring monthly expenses",
    },
    {
      title: "Minimum Payments",
      value: formatCurrency(totalMinimumPayments),
      icon: "💵",
      accent: "text-amber-400",
      footer: "Monthly card minimums",
    },
    {
      title: "Credit Limit",
      value: formatCurrency(totalCreditLimit),
      icon: "🏦",
      accent: "text-violet-400",
      footer: "Combined available credit",
    },
    {
      title: "Utilization",
      value: `${utilization}%`,
      icon: "📊",
      accent:
        utilization >= 90
          ? "text-rose-400"
          : utilization >= 70
          ? "text-amber-400"
          : "text-emerald-400",
      footer: "Overall utilization",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => (
        <SummaryCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}