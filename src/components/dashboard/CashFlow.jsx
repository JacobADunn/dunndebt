import Card from "../ui/Card";
import Button from "../ui/Button";
import useFinance from "../../hooks/useFinance";

export default function CashFlow({ onEdit }) {
  const { cashFlow, bills, cards } = useFinance();

  const {
    checkingBalance,
    weeklyPaycheck,
    nextPayday,
  } = cashFlow;

  const today = new Date().getDate();

  function daysUntil(dueDay) {
    let days = dueDay - today;

    if (days < 0) {
      days += 31;
    }

    return days;
  }

  // Bills due within the next 7 days
  const billsDueThisWeek = bills
    .filter(
      (bill) =>
        !bill.isPaid &&
        daysUntil(bill.dueDay) <= 7
    )
    .reduce(
      (sum, bill) => sum + Number(bill.amount || 0),
      0
    );

  // Card minimum payments due within the next 7 days
  const cardPaymentsDueThisWeek = cards
    .filter(
      (card) =>
        !card.isPaidThisMonth &&
        daysUntil(card.dueDay) <= 7
    )
    .reduce(
      (sum, card) =>
        sum + Number(card.minimumPayment || 0),
      0
    );

  const availableCash =
    checkingBalance +
    weeklyPaycheck -
    billsDueThisWeek -
    cardPaymentsDueThisWeek;

  const totalIncoming =
    checkingBalance + weeklyPaycheck;

  const progress =
    totalIncoming === 0
      ? 0
      : Math.min(
          100,
          Math.max(
            0,
            (availableCash / totalIncoming) * 100
          )
        );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-5xl font-black text-white">
            Weekly Cash Flow
          </h2>

          <p className="mt-2 text-2xl text-slate-400">
            Track your paycheck and safe spending.
          </p>
        </div>

        <Button onClick={onEdit}>
          Update
        </Button>
      </div>

      <Card>
        {/* Top Stats */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-slate-500">
              Checking
            </p>

            <p className="mt-2 text-3xl font-black text-sky-400">
              ${checkingBalance.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm uppercase tracking-widest text-slate-500">
              Weekly Pay
            </p>

            <p className="mt-2 text-3xl font-black text-emerald-400">
              +${weeklyPaycheck.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm uppercase tracking-widest text-slate-500">
              Bills This Week
            </p>

            <p className="mt-2 text-3xl font-black text-rose-400">
              -${billsDueThisWeek.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm uppercase tracking-widest text-slate-500">
              Card Payments
            </p>

            <p className="mt-2 text-3xl font-black text-amber-400">
              -${cardPaymentsDueThisWeek.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Divider */}

        <div className="my-8 border-t border-slate-800" />

        {/* Safe To Spend */}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-lg uppercase tracking-widest text-slate-500">
              Safe To Spend
            </p>

            <h3 className="mt-3 text-6xl font-black text-emerald-400">
              ${availableCash.toFixed(2)}
            </h3>

            <p className="mt-3 text-lg text-slate-400">
              After this week's bills and minimum payments.
            </p>
          </div>

          <div className="w-full max-w-md">
            <div className="mb-3 flex justify-between text-lg">
              <span className="text-slate-400">
                Cash Flow
              </span>

              <span className="font-bold text-white">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p className="mt-5 text-right text-slate-400">
              Next Payday • {nextPayday}
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}