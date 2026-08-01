import { useEffect, useMemo, useState } from "react";

import Modal from "../ui/Modal";
import Button from "../ui/Button";

export default function PaymentModal({
  open,
  card,
  onClose,
  onSave,
}) {
  const [minimum, setMinimum] = useState(0);
  const [extra, setExtra] = useState(0);
  const [markPaid, setMarkPaid] = useState(true);

  useEffect(() => {
    if (!card) return;

    setMinimum(card.minimumPayment || 0);
    setExtra(0);
    setMarkPaid(true);
  }, [card]);

  const totalPayment = useMemo(
    () => Number(minimum) + Number(extra),
    [minimum, extra]
  );

  const projectedBalance = useMemo(
    () =>
      Math.max(
        0,
        Number(card?.balance || 0) - totalPayment
      ),
    [card, totalPayment]
  );

  if (!card) return null;

  function handleSubmit(e) {
    e.preventDefault();

    onSave({
      minimum: Number(minimum),
      extra: Number(extra),
      total: totalPayment,
      markPaid,
    });
  }

  return (
    <Modal
      open={open}
      title="Record Payment"
      size="md"
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Card */}

        <div>

          <p className="text-sm uppercase tracking-widest text-slate-500">
            {card.issuer}
          </p>

          <h2 className="mt-1 text-3xl font-black">
            {card.name}
          </h2>

        </div>

        {/* Summary */}

        <div className="grid grid-cols-2 gap-6">

          <div className="rounded-2xl bg-slate-800 p-5">

            <p className="text-slate-400">
              Current Balance
            </p>

            <p className="mt-2 text-3xl font-black">
              ${card.balance.toFixed(2)}
            </p>

          </div>

          <div className="rounded-2xl bg-slate-800 p-5">

            <p className="text-slate-400">
              Projected Balance
            </p>

            <p className="mt-2 text-3xl font-black text-emerald-400">
              ${projectedBalance.toFixed(2)}
            </p>

          </div>

        </div>

        {/* Payments */}

        <div className="space-y-6">

          <div>

            <label className="mb-2 block text-sm text-slate-400">
              Minimum Payment
            </label>

            <input
              type="number"
              step="0.01"
              value={minimum}
              onChange={(e) => setMinimum(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-5 py-4 text-xl outline-none focus:border-sky-500"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm text-slate-400">
              Additional Payment
            </label>

            <input
              type="number"
              step="0.01"
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-5 py-4 text-xl outline-none focus:border-sky-500"
            />

          </div>

        </div>

        {/* Totals */}

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">

          <div className="flex justify-between">

            <span className="text-slate-400">
              Total Payment
            </span>

            <span className="text-3xl font-black text-emerald-400">
              ${totalPayment.toFixed(2)}
            </span>

          </div>

        </div>

        {/* Paid */}

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            checked={markPaid}
            onChange={(e) => setMarkPaid(e.target.checked)}
          />

          <span>
            Mark card paid for this month
          </span>

        </label>

        {/* Buttons */}

        <div className="flex justify-end gap-4">

          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="success"
          >
            Record Payment
          </Button>

        </div>

      </form>
    </Modal>
  );
