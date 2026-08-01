import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import ProgressBar from "../ui/ProgressBar";

export default function CreditCard({
  card,
  onEdit,
  onDelete,
  onRecordPayment,
}) {
  const utilization =
    Math.min(
      100,
      Math.round((card.balance / card.creditLimit) * 100)
    ) || 0;

  const progressColor =
    utilization >= 90
      ? "bg-rose-500"
      : utilization >= 70
      ? "bg-amber-500"
      : "bg-emerald-500";

  // ----------------------------
  // Due Status
  // ----------------------------

  const today = new Date().getDate();

  let daysUntil = card.dueDay - today;

  if (daysUntil < 0) {
    daysUntil += 31;
  }

  let badgeColor = "blue";
  let badgeText = `Due in ${daysUntil} Days`;

  if (card.isPaidThisMonth) {
    badgeColor = "green";
    badgeText = "Paid";
  } else if (daysUntil <= 0) {
    badgeColor = "red";
    badgeText = "Due Today";
  } else if (daysUntil <= 3) {
    badgeColor = "orange";
    badgeText = `Due in ${daysUntil} Days`;
  } else if (daysUntil <= 7) {
    badgeColor = "yellow";
    badgeText = `Due in ${daysUntil} Days`;
  }

  return (
    <Card className="flex h-full flex-col">

      {/* Header */}

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0 flex-1">

          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
            {card.issuer}
          </p>

          <h3
            className="mt-1 truncate text-[1.2rem] font-black"
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

        <div className="flex-shrink-0 whitespace-nowrap">
          <Badge color={badgeColor}>
            {badgeText}
          </Badge>
        </div>

      </div>

      {/* Balance */}

      <div className="mt-8">

        <p className="text-3xl font-black tracking-tight">
          ${card.balance.toFixed(2)}
        </p>

        <p className="mt-2 text-slate-400">
          Current Balance
        </p>

      </div>

      {/* Utilization */}

      <div className="mt-8">

        <div className="mb-2 flex items-center justify-between">

          <span className="font-medium">
            Utilization
          </span>

          <span className="font-bold">
            {utilization}%
          </span>

        </div>

        <ProgressBar
          value={utilization}
          color={progressColor}
        />

      </div>

      {/* Details */}

      <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6">

        <div>
          <p className="text-slate-400">
            Credit Limit
          </p>

          <p className="text-xl font-bold">
            ${card.creditLimit.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-slate-400">
            Available
          </p>

          <p className="text-xl font-bold text-emerald-400">
            ${(card.creditLimit - card.balance).toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-slate-400">
            APR
          </p>

          <p className="text-xl font-bold">
            {card.apr}%
          </p>
        </div>

        <div>
          <p className="text-slate-400">
            Minimum Payment
          </p>

          <p className="text-xl font-bold">
            ${card.minimumPayment.toFixed(2)}
          </p>
        </div>

      </div>

      {/* Push actions to bottom */}

      <div className="flex-1" />

      {/* Actions */}

      <div className="mt-8 grid grid-cols-3 gap-3">

        <Button
          variant="success"
          onClick={onRecordPayment}
        >
          Payment
        </Button>

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