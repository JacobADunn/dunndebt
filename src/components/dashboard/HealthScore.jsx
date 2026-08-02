import Card from "../ui/Card";
import useFinance from "../../hooks/useFinance";
import FinancialTimeline from "./FinancialTimeline";
import {
  calculateHealthScore,
  getAttackCard,
} from "../../utils/financeEngine";

export default function HealthScore() {
  const {
    cards,
    bills,
    cashFlow,
    payoffStrategy = "avalanche",
  } = useFinance();

  const health = calculateHealthScore(
    cards,
    bills,
    cashFlow
  );

  const attackCard = getAttackCard(
    cards,
    payoffStrategy
  );

  return (
    <section className="space-y-6">

      <div>

        <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">
          Debt Freedom
        </h2>

        <p className="mt-2 text-base text-slate-400 sm:text-lg">
          Your financial health and recommended next payment.
        </p>

      </div>

      <Card className="overflow-hidden">

        <div className="grid gap-12 lg:grid-cols-[1.45fr_0.8fr]">

          {/* ===================================== */}
          {/* LEFT */}
          {/* ===================================== */}

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
              Overall Progress
            </p>

            {/* Debt Scale */}

            <div className="mt-6">

              <div className="mb-3 flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">

                <span>Poor</span>
                <span>Fair</span>
                <span>Good</span>
                <span>Great</span>
                <span>Excellent</span>

              </div>

              <div className="relative">

                <div className="h-3 rounded-full bg-slate-800">

                  <div className="absolute inset-y-0 left-0 right-0 flex justify-between px-[2px]">

                    {[20, 40, 60, 80].map((tick) => (
                      <div
                        key={tick}
                        className="h-full w-px bg-slate-700"
                      />
                    ))}

                  </div>

                </div>

                <div
                  className="absolute -top-2 transition-all duration-500"
                  style={{
                    left: `calc(${health.scalePosition}% - 10px)`,
                  }}
                >

                  <div
                    className={`h-6 w-6 rounded-full border-4 border-slate-900 ${
                      health.score >= 90
                        ? "bg-emerald-400"
                        : health.score >= 75
                        ? "bg-green-400"
                        : health.score >= 60
                        ? "bg-sky-400"
                        : health.score >= 40
                        ? "bg-amber-400"
                        : "bg-rose-400"
                    }`}
                  />

                </div>

              </div>

            </div>

            <h2
              className={`mt-8 text-5xl font-black ${health.color}`}
            >
              {health.label}
            </h2>

            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-400">
              {health.summary}
            </p>

            {/* Recommended Payment */}

            {attackCard && (

              <div className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/40 p-7">

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                  Recommended Payment
                </p>

                <h3 className="mt-3 text-4xl font-black">
                  {attackCard.name}
                </h3>

                <p className="mt-3 text-slate-400">
                  {attackCard.reason}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-8">

                  <div>

                    <p className="text-sm text-slate-500">
                      Balance
                    </p>

                    <p className="mt-2 text-3xl font-black">
                      $
                      {attackCard.balance.toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      APR
                    </p>

                    <p className="mt-2 text-3xl font-black text-amber-400">
                      {attackCard.apr.toFixed(2)}%
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      Monthly Interest
                    </p>

                    <p className="mt-2 text-3xl font-black text-rose-400">
                      $
                      {attackCard.monthlyInterest.toFixed(
                        2
                      )}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      Minimum Payment
                    </p>

                    <p className="mt-2 text-3xl font-black text-sky-400">
                      $
                      {attackCard.minimumPayment.toFixed(
                        2
                      )}
                    </p>

                  </div>

                </div>

              </div>

            )}

          </div>

          {/* ===================================== */}
          {/* RIGHT */}
          {/* ===================================== */}

          <div className="flex items-center justify-center">

            <div className="text-center">

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                Debt Freedom Score
              </p>

              <h1 className="mt-6 text-9xl font-black leading-none">
                {health.score}
              </h1>

              <p
                className={`mt-5 text-3xl font-black ${health.color}`}
              >
                {health.label}
              </p>

              <p className="mt-4 max-w-xs text-sm leading-7 text-slate-500">
                Calculated from your utilization,
                payment history, cash buffer and
                current bills.
              </p>

            </div>

          </div>

        </div>

        {/* Divider */}

        <div className="my-12 border-t border-slate-800" />

        {/* Timeline Placeholder */}

        <div>

          <p className="mb-8 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
            Upcoming Timeline
          </p>

          <FinancialTimeline />

        </div>

      </Card>

    </section>
  );
}