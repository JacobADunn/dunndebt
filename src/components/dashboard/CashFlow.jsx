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

  const weekdayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  function daysUntilWeekday(dayName) {
    const todayWeekday = new Date().getDay();
    const target = weekdayMap[dayName];

    let diff = target - todayWeekday;

    if (diff < 0) diff += 7;

    return diff;
  }

  function daysUntilDueDay(dueDay) {
    let diff = dueDay - today;

    if (diff < 0) diff += 31;

    return diff;
  }

  const daysUntilPayday =
    daysUntilWeekday(nextPayday);

  const billsUntilPayday = bills
    .filter((bill) => {
      if (bill.isPaid) return false;

      return (
        daysUntilDueDay(bill.dueDay) <=
        daysUntilPayday
      );
    })
    .reduce(
      (sum, bill) =>
        sum + Number(bill.amount || 0),
      0
    );

  const minimumPayments = cards
    .filter((card) => {
      if (card.isPaidThisMonth) return false;

      return (
        daysUntilDueDay(card.dueDay) <=
        daysUntilPayday
      );
    })
    .reduce(
      (sum, card) =>
        sum +
        Number(card.minimumPayment || 0),
      0
    );

  const availableForDebt =
    checkingBalance +
    weeklyPaycheck -
    billsUntilPayday -
    minimumPayments;

  const progress =
    checkingBalance + weeklyPaycheck === 0
      ? 0
      : Math.min(
          100,
          Math.max(
            0,
            (availableForDebt /
              (checkingBalance +
                weeklyPaycheck)) *
              100
          )
        );

  return (
    <section className="space-y-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">
            Paycheck Planner
          </h2>

          <p className="mt-2 text-base text-slate-400 sm:text-lg">
            Know exactly how much you can safely put toward debt.
          </p>

        </div>

        <Button onClick={onEdit}>
          Update
        </Button>

      </div>

      <Card>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div>

            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Checking
            </p>

            <p className="mt-3 text-3xl font-black text-sky-400">
              ${checkingBalance.toFixed(2)}
            </p>

          </div>

          <div>

            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Next Paycheck
            </p>

            <p className="mt-3 text-3xl font-black text-emerald-400">
              +${weeklyPaycheck.toFixed(2)}
            </p>

          </div>

          <div>

            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Bills Until Payday
            </p>

            <p className="mt-3 text-3xl font-black text-rose-400">
              -${billsUntilPayday.toFixed(2)}
            </p>

          </div>

          <div>

            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Card Minimums
            </p>

            <p className="mt-3 text-3xl font-black text-amber-400">
              -${minimumPayments.toFixed(2)}
            </p>

          </div>

        </div>

        <div className="my-8 border-t border-slate-800" />

        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-lg uppercase tracking-widest text-slate-500">
              Safe Extra Payment
            </p>

            <h3 className="mt-3 text-4xl font-black text-emerald-400 sm:text-5xl lg:text-6xl">
              ${availableForDebt.toFixed(2)}
            </h3>

            <p className="mt-3 max-w-xl text-slate-400">
              After paying every bill and every minimum payment due before your next paycheck.
            </p>

          </div>

          <div className="w-full max-w-md">

            <div className="mb-3 flex justify-between">

              <span className="text-slate-400">
                Cash Available
              </span>

              <span className="font-bold">
                {Math.round(progress)}%
              </span>

            </div>

            <div className="h-4 overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
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