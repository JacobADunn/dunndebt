import { useEffect, useState } from "react";

import Input from "../ui/Input";
import Button from "../ui/Button";

const emptyCard = {
  name: "",
  issuer: "",
  network: "",
  balance: "",
  creditLimit: "",
  apr: "",
  minimumPayment: "",
  dueDay: 1,
  autoPay: false,
};

export default function CreditCardForm({
  initialData,
  onSave,
  onCancel,
}) {
  const [card, setCard] = useState(emptyCard);

  useEffect(() => {
    setCard(initialData || emptyCard);
  }, [initialData]);

  function update(field, value) {
    setCard((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit() {
    if (!card.name.trim()) {
      alert("Card name is required.");
      return;
    }

    if (Number(card.creditLimit) <= 0) {
      alert("Credit limit must be greater than 0.");
      return;
    }

    onSave({
      ...card,
      balance: Number(card.balance),
      creditLimit: Number(card.creditLimit),
      apr: Number(card.apr),
      minimumPayment: Number(card.minimumPayment),
      dueDay: Number(card.dueDay),
    });
  }

  return (
    <div className="space-y-4">

      <Input
        label="Card Name"
        value={card.name}
        onChange={(e) => update("name", e.target.value)}
      />

      <Input
        label="Issuer"
        value={card.issuer}
        onChange={(e) => update("issuer", e.target.value)}
      />

      <Input
        label="Network"
        value={card.network}
        onChange={(e) => update("network", e.target.value)}
      />

      <Input
        label="Current Balance"
        type="number"
        value={card.balance}
        onChange={(e) => update("balance", e.target.value)}
      />

      <Input
        label="Credit Limit"
        type="number"
        value={card.creditLimit}
        onChange={(e) => update("creditLimit", e.target.value)}
      />

      <Input
        label="APR (%)"
        type="number"
        value={card.apr}
        onChange={(e) => update("apr", e.target.value)}
      />

      <Input
        label="Minimum Payment"
        type="number"
        value={card.minimumPayment}
        onChange={(e) => update("minimumPayment", e.target.value)}
      />

      <Input
        label="Due Day"
        type="number"
        min={1}
        max={31}
        value={card.dueDay}
        onChange={(e) => update("dueDay", e.target.value)}
      />

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={card.autoPay}
          onChange={(e) => update("autoPay", e.target.checked)}
        />
        <span>AutoPay Enabled</span>
      </label>

      <div className="flex justify-end gap-3 pt-4">

        <Button
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button onClick={handleSubmit}>
          {initialData ? "Save Changes" : "Add Card"}
        </Button>

      </div>

    </div>
  );
}