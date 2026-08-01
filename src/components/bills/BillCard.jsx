import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export default function BillCard({
  bill,
  onEdit,
  onDelete,
  onTogglePaid,
}) {
  const today = new Date().getDate();

  let daysUntil = bill.dueDay - today;

  if (daysUntil < 0) {
    daysUntil += 31;
  }

  let badgeColor = "blue";
  let badgeText = `Due in ${daysUntil} Days`;

  if (bill.isPaid) {
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
            {bill.category}
          </p>

          <h3
            className="mt-1 truncate text-[1.2rem] font-black"
            title={bill.name}
          >
            {bill.name}
          </h3>

          {bill.autoPay && (
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

      {/* Amount */}

      <div className="mt-8">

        <p className="text-3xl font-black tracking-tight">
          ${bill.amount.toFixed(2)}
        </p>

        <p className="mt-2 text-slate-400">
          Monthly Payment
        </p>

      </div>

      {/* Details */}

      <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6">

        <div>
          <p className="text-slate-400">
            Due Day
          </p>

          <p className="text-xl font-bold">
            {bill.dueDay}
          </p>
        </div>

        <div>
          <p className="text-slate-400">
            Status
          </p>

          <p
            className={`text-xl font-bold ${
              bill.isPaid
                ? "text-emerald-400"
                : "text-amber-400"
            }`}
          >
            {bill.isPaid ? "Paid" : "Pending"}
          </p>
        </div>

      </div>

      {/* Push actions to bottom */}

      <div className="flex-1" />

      {/* Actions */}

      <div className="mt-8 grid grid-cols-3 gap-3">

        <Button
          variant={bill.isPaid ? "secondary" : "success"}
          onClick={onTogglePaid}
        >
          {bill.isPaid ? "Unpaid" : "Paid"}
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