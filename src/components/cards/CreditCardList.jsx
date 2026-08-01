import SectionHeader from "../ui/SectionHeader";
import EmptyState from "../ui/EmptyState";
import CreditCard from "./CreditCard";

export default function CreditCardList({
  cards = [],
  onAddCard,
  onEditCard,
  onDeleteCard,
  onRecordPayment,
}) {
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

      {cards.length === 0 ? (
        <EmptyState
          icon="💳"
          title="No Credit Cards"
          message="Add your first credit card to begin tracking balances and payments."
          buttonLabel="Add Card"
          onClick={onAddCard}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {cards.map((card) => (
        
        <CreditCard
            key={card.id}
            card={card}

            onEdit={() => onEditCard(card)}

            onDelete={() => onDeleteCard(card)}

            onRecordPayment={() => onRecordPayment(card)}
        />
          ))}

        </div>
      )}

    </section>
  );
}