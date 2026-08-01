import { useMemo } from "react";

import SectionHeader from "../ui/SectionHeader";
import EmptyState from "../ui/EmptyState";
import BillCard from "./BillCard";

export default function BillsList({
  bills = [],
  onAddBill,
  onEditBill,
  onDeleteBill,
  onTogglePaid,
}) {
  const totalBills = useMemo(
    () =>
      bills.reduce(
        (sum, bill) => sum + Number(bill.amount || 0),
        0
      ),
    [bills]
  );

  return (
    <section className="space-y-6">

      <SectionHeader
        title="Monthly Bills"
        subtitle={`${bills.length} recurring bills • $${totalBills.toFixed(
          2
        )}/month`}
        actionLabel="+ Add Bill"
        onAction={onAddBill}
      />

      {bills.length === 0 ? (
        <EmptyState
          icon="💸"
          title="No Bills Yet"
          message="Add your first recurring bill to begin tracking payments."
          buttonLabel="Add Bill"
          onClick={onAddBill}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {bills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              onEdit={() => onEditBill(bill)}
              onDelete={() => onDeleteBill(bill)}
              onTogglePaid={() => onTogglePaid(bill.id)}
            />
          ))}

        </div>
      )}

    </section>
  );
}