import Card from "../ui/Card";
import useFinance from "../../hooks/useFinance";

export default function HealthScore() {
  const { utilization, bills, cards } = useFinance();

  function calculateScore() {
    let score = 100;

    // Credit Utilization
    if (utilization >= 95) score -= 40;
    else if (utilization >= 90) score -= 30;
    else if (utilization >= 70) score -= 20;
    else if (utilization >= 50) score -= 10;

    // Unpaid Bills
    const unpaidBills = bills.filter((bill) => !bill.isPaid).length;
    score -= unpaidBills * 2;

    // Cards Not Paid
    const unpaidCards = cards.filter((card) => !card.isPaidThisMonth).length;
    score -= unpaidCards * 3;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  const score = calculateScore();

  let status = "Excellent";
  let color = "text-emerald-400";
  let progress = "bg-emerald-500";

  if (score < 95) {
    status = "Good";
    color = "text-sky-400";
    progress = "bg-sky-500";
  }

  if (score < 80) {
    status = "Needs Attention";
    color = "text-amber-400";
    progress = "bg-amber-500";
  }

  if (score < 60) {
    status = "Critical";
    color = "text-rose-400";
    progress = "bg-rose-500";
  }

  // Generate one helpful insight
  let insight = "Everything looks healthy.";

  if (utilization >= 90) {
    insight = "High credit utilization is hurting your score.";
  } else if (cards.some((c) => !c.isPaidThisMonth)) {
    insight = "One or more credit card payments are still outstanding.";
  } else if (bills.some((b) => !b.isPaid)) {
    insight = "You still have unpaid bills due this month.";
  }

  return (
    <Card className="p-8">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
            Financial Health
          </p>

          <h2 className={`mt-2 text-7xl font-black ${color}`}>
            {score}
          </h2>

          <p className={`mt-1 text-2xl font-bold ${color}`}>
            {status}
          </p>

        </div>

        <div className="text-6xl">
          🎯
        </div>

      </div>

      <div className="mt-8">

        <div className="mb-2 flex justify-between text-sm text-slate-400">
          <span>Overall Score</span>
          <span>{score}%</span>
        </div>

        <div className="h-4 overflow-hidden rounded-full bg-slate-800">

          <div
            className={`h-full rounded-full ${progress}`}
            style={{ width: `${score}%` }}
          />

        </div>

      </div>

      <div className="mt-8 grid grid-cols-3 gap-6 text-center">

        <div>
          <p className="text-3xl font-bold">{utilization}%</p>
          <p className="mt-1 text-sm text-slate-400">
            Utilization
          </p>
        </div>

        <div>
          <p className="text-3xl font-bold">
            {cards.length}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Credit Cards
          </p>
        </div>

        <div>
          <p className="text-3xl font-bold">
            {bills.length}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Monthly Bills
          </p>
        </div>

      </div>

      <div className="mt-8 rounded-2xl bg-slate-800 p-5">

        <p className="text-sm uppercase tracking-widest text-slate-500">
          Insight
        </p>

        <p className="mt-2 text-lg">
          {insight}
        </p>

      </div>

    </Card>
  );
}