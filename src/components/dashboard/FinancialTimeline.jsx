import useFinance from "../../hooks/useFinance";

export default function FinancialTimeline() {
  const {
    bills,
    cards,
    cashFlow,
  } = useFinance();

  const today = new Date().getDate();

  function daysUntil(dueDay) {
    let days = dueDay - today;

    if (days < 0) days += 31;

    return days;
  }

  const events = [];

  cards.forEach((card) => {
    if (card.isPaidThisMonth) return;

    events.push({
      id: `card-${card.id}`,
      type: "card",
      title: card.name,
      subtitle: `$${card.minimumPayment.toFixed(2)}`,
      dueDay: card.dueDay,
      days: daysUntil(card.dueDay),
      complete: false,
    });
  });

  bills.forEach((bill) => {
    if (bill.isPaid) return;

    events.push({
      id: `bill-${bill.id}`,
      type: "bill",
      title: bill.name,
      subtitle: `$${bill.amount.toFixed(2)}`,
      dueDay: bill.dueDay,
      days: daysUntil(bill.dueDay),
      complete: false,
    });
  });

  if (
    cashFlow?.nextPayday &&
    cashFlow?.weeklyPaycheck
  ) {
    events.push({
      id: "payday",
      type: "payday",
      title: "Payday",
      subtitle: `+$${Number(
        cashFlow.weeklyPaycheck
      ).toFixed(2)}`,
      weekday: cashFlow.nextPayday,
      days: 999,
      complete: false,
    });
  }

  events.sort((a, b) => {
    if (a.days !== b.days)
      return a.days - b.days;

    if (a.type === b.type)
      return 0;

    return a.type === "card"
      ? -1
      : 1;
  });

  const timeline = events.slice(0, 5);

  function getIcon(event) {
    if (event.type === "payday")
      return "◆";

    return "●";
  }

  function getColor(event) {
    if (event.complete)
      return "text-emerald-400";

    if (event.type === "payday")
      return "text-sky-400";

    return "text-slate-300";
  }

  function getLabel(event) {
    if (event.type === "payday")
      return event.weekday;

    if (event.days === 0)
      return "Today";

    if (event.days === 1)
      return "Tomorrow";

    return `${event.days} Days`;
  }

  return (
    <div className="overflow-x-auto pb-2">

      <div className="relative min-w-[720px]">

        <div className="absolute left-0 right-0 top-[46px] h-[2px] bg-slate-800" />

        <div className="relative grid grid-cols-5">

          {timeline.map((event) => (

            <div
              key={event.id}
              className="flex flex-col items-center text-center"
            >

              <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                {getLabel(event)}
              </p>

              <div
                className={`z-10 text-2xl ${getColor(event)}`}
              >
                {getIcon(event)}
              </div>

              <h4 className="mt-5 text-lg font-bold">
                {event.title}
              </h4>

              <p className="mt-1 text-sm text-slate-400">
                {event.subtitle}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}