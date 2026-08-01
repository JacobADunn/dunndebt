import Card from "../ui/Card";
import useFinance from "../../hooks/useFinance";

export default function ActionRequired() {
  const { bills, cards } = useFinance();

  const today = new Date();
  const currentDay = today.getDate();

  function daysUntil(dueDay) {
    let days = dueDay - currentDay;

    if (days < 0) days += 31;

    return days;
  }

  function getStatus(days) {
    if (days === 0)
      return {
        label: "TODAY",
        color: "bg-red-600",
      };

    if (days === 1)
      return {
        label: "TOMORROW",
        color: "bg-orange-500",
      };

    if (days <= 3)
      return {
        label: `${days} DAYS LEFT`,
        color: "bg-sky-500",
      };

    return {
      label: `${days} DAYS LEFT`,
      color: "bg-emerald-500",
    };
  }

  const notifications = [];

  cards.forEach((card) => {
    if (card.isPaidThisMonth) return;

    const days = daysUntil(card.dueDay);

    if (days <= 7) {
      notifications.push({
        id: `card-${card.id}`,
        type: "card",
        days,
        dueDay: card.dueDay,
        title: card.name,
        subtitle: `Minimum Payment • $${card.minimumPayment.toFixed(2)}`,
      });
    }
  });

  bills.forEach((bill) => {
    if (bill.isPaid) return;

    const days = daysUntil(bill.dueDay);

    if (days <= 7) {
      notifications.push({
        id: `bill-${bill.id}`,
        type: "bill",
        days,
        dueDay: bill.dueDay,
        title: bill.name,
        subtitle: `$${bill.amount.toFixed(2)}`,
      });
    }
  });

  notifications.sort((a, b) => {
    if (a.days !== b.days) return a.days - b.days;

    if (a.type === b.type) return 0;

    return a.type === "card" ? -1 : 1;
  });

  return (
    <Card>
      <h2 className="mb-5 text-2xl font-black">
        🚨 Action Required
      </h2>

      {notifications.length === 0 ? (
        <div className="rounded-xl bg-emerald-500/10 p-6 text-center">
          <p className="text-lg font-semibold">
            ✅ You're caught up this week.
          </p>

          <p className="mt-1 text-slate-400">
            No payments due in the next 7 days.
          </p>
        </div>
      ) : (
        <div className="space-y-3">

          {notifications.map((item) => {
            const status = getStatus(item.days);

            return (
              <div
                key={item.id}
                className="flex overflow-hidden rounded-xl bg-slate-800"
              >
                <div className={`w-2 ${status.color}`} />

                <div className="flex flex-1 items-center justify-between p-4">

                  <div>

                    <p className="text-xs font-bold tracking-widest text-slate-400">
                      {status.label}
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      {item.title}
                    </h3>

                    <p className="text-slate-400">
                      {item.subtitle}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Payment Due • Day {item.dueDay}
                    </p>

                  </div>

                  <div className="text-right">

                    <div className="text-3xl">
                      {item.type === "card" ? "💳" : "🏠"}
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-300">
                      {item.days === 0
                        ? "Due Today"
                        : item.days === 1
                        ? "1 day remaining"
                        : `${item.days} days remaining`}
                    </p>

                  </div>

                </div>
              </div>
            );
          })}

        </div>
      )}
    </Card>
  );
}