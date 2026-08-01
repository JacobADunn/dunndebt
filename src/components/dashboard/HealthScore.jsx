import Card from "../ui/Card";
import Badge from "../ui/Badge";
import useFinance from "../../hooks/useFinance";

export default function HealthScore() {
  const {
    utilization,
    totalDebt,
    totalMinimumPayments,
  } = useFinance();

  let score = 100;

  if (utilization > 30) score -= (utilization - 30) * 0.6;
  if (totalDebt > 10000) score -= 10;
  if (totalDebt > 20000) score -= 10;
  if (totalMinimumPayments > 1000) score -= 10;

  score = Math.max(0, Math.round(score));

  let color = "text-emerald-400";
  let badgeColor = "green";
  let status = "Excellent";

  if (score < 80) {
    color = "text-amber-400";
    badgeColor = "yellow";
    status = "Good";
  }

  if (score < 60) {
    color = "text-orange-400";
    badgeColor = "yellow";
    status = "Needs Work";
  }

  if (score < 40) {
    color = "text-rose-400";
    badgeColor = "red";
    status = "Critical";
  }

  return (
    <section className="space-y-6">

      <div>
        <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">
          Financial Health
        </h2>

        <p className="mt-2 text-base text-slate-400 sm:text-lg">
          A quick snapshot of your overall financial position.
        </p>
      </div>

      <Card>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          {/* Left */}

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
              Health Score
            </p>

            <h1 className={`mt-4 text-5xl font-black sm:text-6xl ${color}`}>
              {score}
            </h1>

            <div className="mt-5">
              <Badge color={badgeColor}>
                {status}
              </Badge>
            </div>

          </div>

          {/* Right */}

          <div className="w-full max-w-xl">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Score
              </span>

              <span className={`text-lg font-bold ${color}`}>
                {score}/100
              </span>

            </div>

            <div className="h-4 overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${score}%`,
                }}
              />

            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  Debt
                </p>

                <p className="mt-2 text-xl font-bold text-white">
                  ${totalDebt.toFixed(0)}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  Utilization
                </p>

                <p className="mt-2 text-xl font-bold text-white">
                  {utilization}%
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  Min Payments
                </p>

                <p className="mt-2 text-xl font-bold text-white">
                  ${totalMinimumPayments.toFixed(0)}
                </p>
              </div>

            </div>

          </div>

        </div>

      </Card>

    </section>
  );
}