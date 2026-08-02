import { useMemo } from "react";

import SectionHeader from "../ui/SectionHeader";
import EmptyState from "../ui/EmptyState";
import CreditCard from "./CreditCard";

export default function CreditCardList({
  cards = [],
  onAddCard,
  onEditCard,
  onDeleteCard,
  onRecordPayment,
  onUndoPayment,
}) {
  const sortedCards = useMemo(() => {
    const today = new Date().getDate();

    function daysUntil(dueDay) {
      let days = dueDay - today;

      if (days < 0) days += 31;

      return days;
    }

    const unpaid = cards
      .filter((card) => !card.isPaidThisMonth)
      .sort((a, b) => {
        const dayDiff =
          daysUntil(a.dueDay) -
          daysUntil(b.dueDay);

        if (dayDiff !== 0) return dayDiff;

        return a.dueDay - b.dueDay;
      });

    const paid = cards
      .filter((card) => card.isPaidThisMonth)
      .sort((a, b) => {
        const dayDiff =
          daysUntil(a.dueDay) -
          daysUntil(b.dueDay);

        if (dayDiff !== 0) return dayDiff;

        return a.dueDay - b.dueDay;
      });

    return [...unpaid, ...paid];
  }, [cards]);

  return (
    <section className="space-y-6">

      <SectionHeader
        title="Credit Cards"
        subtitle={`Track ${cards.length} credit card${
          cards.length === 1 ? "" : "s"
        }, balances and utilization.`}
        actionLabel="+ Add Card"
        onAction={onAddCard}
      />

      {sortedCards.length === 0 ? (
        <EmptyState
          icon="💳"
          title="No Credit Cards"
          message="Add your first credit card to begin tracking balances and payments."
          buttonLabel="Add Card"
          onClick={onAddCard}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {sortedCards.map((card) => (
            <CreditCard
              key={card.id}
              card={card}
              onEdit={() => onEditCard(card)}
              onDelete={() => onDeleteCard(card)}
              onRecordPayment={() =>
                  onRecordPayment(card)
              }
              onUndoPayment={() =>
                onUndoPayment(card.id)
              }
            />
          ))}

        </div>
      )}

    </section>
  );
}