import useFinance from "../../hooks/useFinance";
import { buildTimelineEvents } from "../../utils/financeEngine";

export default function FinancialTimeline() {
  const {
    bills,
    cards,
    cashFlow,
  } = useFinance();

  const events = buildTimelineEvents(
    bills,
    cards,
    cashFlow
  ).slice(0, 5);

  function getIcon(event) {
    switch (event.type) {
      case "payday":
        return "◆";

      case "bill":
      case "card":
      default:
        return "●";
    }
  }

  function getColor(event) {
    if (event.complete)
      return "text-emerald-400";

    if (event.type === "payday")
      return "text-sky-400";

    return "text-slate-300";
  }

  function getDayLabel(day) {
    const today = new Date().getDate();

    if (day === today) return "Today";

    if (day === today + 1)
      return "Tomorrow";

    return `Day ${day}`;
  }

  return (
    <div className="overflow-x-auto pb-2">

      <div className="relative min-w-[720px]">

        {/* Timeline Line */}

        <div className="absolute left-0 right-0 top-[46px] h-[2px] bg-slate-800" />

        <div className="relative grid grid-cols-5">

          {events.map((event) => (

            <div
              key={event.id}
              className="flex flex-col items-center text-center"
            >

              <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">

                {event.day
                  ? getDayLabel(event.day)
                  : event.weekday}

              </p>

              <div
                className={`z-10 text-2xl ${getColor(
                  event
                )}`}
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