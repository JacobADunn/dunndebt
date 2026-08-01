import { useEffect, useState } from "react";

import Input from "../ui/Input";
import Button from "../ui/Button";

export default function BillForm({
  initialData,
  onSave,
  onCancel,
}) {
  const emptyBill = {
    name: "",
    amount: "",
    dueDay: 1,
    category: "Other",
    autoPay: false,
    notes: "",
  };

  const [bill, setBill] = useState(emptyBill);

  useEffect(() => {
    if (initialData) {
      setBill(initialData);
    } else {
      setBill(emptyBill);
    }
  }, [initialData]);

  function update(field, value) {
    setBill((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSave({
      ...bill,
      amount: Number(bill.amount),
      dueDay: Number(bill.dueDay),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Input
        label="Bill Name"
        value={bill.name}
        onChange={(e) =>
          update("name", e.target.value)
        }
      />

      <Input
        label="Amount"
        type="number"
        value={bill.amount}
        onChange={(e) =>
          update("amount", e.target.value)
        }
      />

      <Input
        label="Due Day"
        type="number"
        min={1}
        max={31}
        value={bill.dueDay}
        onChange={(e) =>
          update("dueDay", e.target.value)
        }
      />

      <Input
        label="Category"
        value={bill.category}
        onChange={(e) =>
          update("category", e.target.value)
        }
      />

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={bill.autoPay}
          onChange={(e) =>
            update("autoPay", e.target.checked)
          }
        />

        <span>Autopay Enabled</span>
      </label>

      <Input
        label="Notes"
        value={bill.notes}
        onChange={(e) =>
          update("notes", e.target.value)
        }
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button type="submit">
          {initialData ? "Save Changes" : "Add Bill"}
        </Button>
      </div>
    </form>
  );
}