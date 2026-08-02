import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import ProgressBar from "../ui/ProgressBar";

export default function CreditCard({
  card,
  onEdit,
  onDelete,
  onRecordPayment,
  onUndoPayment,
}) {
  const utilization =
    Number(card.creditLimit) > 0
      ? Math.round(
          (Number(card.balance) /
            Number(card.creditLimit)) *
            100
        )
      : 0;

  const available =
    Number(card.creditLimit) -
    Number(card.balance);

  const today = new Date().getDate();

  let daysUntil = card.dueDay - today;

  if (daysUntil < 0) {
    daysUntil += 31;
  }

  let badgeColor = "blue";
  let badgeText = `${daysUntil} Days`;

  if (card.isPaidThisMonth) {
    badgeColor = "green";
    badgeText = "Paid";
  } else if (daysUntil <= 0) {
    badgeColor = "red";
    badgeText = "Today";
  } else if (daysUntil === 1) {
    badgeColor = "orange";
    badgeText = "Tomorrow";
  } else if (daysUntil <= 3) {
    badgeColor = "orange";
  } else if (daysUntil <= 7) {
    badgeColor = "yellow";
  }

  const progressColor =
    utilization >= 90
      ? "bg-rose-500"
      : utilization >= 80
      ? "bg-amber-500"
      : "bg-emerald-500";

  return (
    <Card className="flex h-full flex-col">

      {/* Header */}

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div className="min-w-0 flex-1">

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
            {card.issuer}
          </p>

          <h3
            className="mt-2 truncate text-[1.2rem] font-black"
            title={card.name}
          >
            {card.name}
          </h3>

          {card.autoPay && (
            <p className="mt-2 text-sm font-semibold text-emerald-400">
              ✓ Autopay Enabled
            </p>
          )}

        </div>

        <Badge color={badgeColor}>
          {badgeText}
        </Badge>

      </div>

      {/* Balance */}

      <div className="mt-8">

        <h2 className="text-3xl font-black tracking-tight">
          ${Number(card.balance).toFixed(2)}
        </h2>

        <p className="mt-2 text-slate-400">
          Current Balance
        </p>

      </div>

      {/* Utilization */}

      <div className="mt-8">

        <div className="mb-3 flex items-center justify-between">

          <span className="text-xl font-semibold">
            Utilization
          </span>

          <span className="text-xl font-bold">
            {utilization}%
          </span>

        </div>

        <ProgressBar
          value={utilization}
          color={progressColor}
        />

      </div>

      {/* Details */}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6">

        <div>
          <p className="text-slate-400">
            Credit Limit
          </p>

          <p className="text-2xl font-bold">
            ${Number(card.creditLimit).toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-slate-400">
            Available
          </p>

          <p className="text-2xl font-bold text-emerald-400">
            ${available.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-slate-400">
            APR
          </p>

          <p className="text-2xl font-bold">
            {card.apr}%
          </p>
        </div>

        <div>
          <p className="text-slate-400">
            Minimum Payment
          </p>

          <p className="text-2xl font-bold">
            ${Number(card.minimumPayment).toFixed(2)}
          </p>
        </div>

      </div>

      <div className="flex-1" />

      {/* Actions */}

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">

        {card.isPaidThisMonth ? (
          <Button
            variant="secondary"
            onClick={onUndoPayment}
          >
            Unpaid
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={onRecordPayment}
          >
            Payment
          </Button>
        )}

        <Button
          variant="secondary"
          onClick={onEdit}
        >
          Edit
        </Button>

        <Button
          variant="danger"
          onClick={onDelete}
        >
          Delete
        </Button>

      </div>

    </Card>
  );
}