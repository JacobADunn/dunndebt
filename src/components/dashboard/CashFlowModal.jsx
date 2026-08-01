import { useEffect, useState } from "react";

export default function CashFlowModal({
  initialData,
  onSave,
  onCancel,
}) {
  const [checkingBalance, setCheckingBalance] = useState(0);
  const [weeklyPaycheck, setWeeklyPaycheck] = useState(0);
  const [payFrequency, setPayFrequency] = useState("Weekly");
  const [nextPayday, setNextPayday] = useState("Friday");

  useEffect(() => {
    if (initialData) {
      setCheckingBalance(initialData.checkingBalance ?? 0);
      setWeeklyPaycheck(initialData.weeklyPaycheck ?? 0);
      setPayFrequency(initialData.payFrequency ?? "Weekly");
      setNextPayday(initialData.nextPayday ?? "Friday");
    }
  }, [initialData]);

  function handleSubmit(e) {
    e.preventDefault();

    onSave({
      checkingBalance: Number(checkingBalance),
      weeklyPaycheck: Number(weeklyPaycheck),
      payFrequency,
      nextPayday,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Checking Balance
        </label>

        <input
          type="number"
          step="0.01"
          value={checkingBalance}
          onChange={(e) => setCheckingBalance(e.target.value)}
          className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-5 py-4 text-lg text-white outline-none focus:border-sky-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Weekly Paycheck
        </label>

        <input
          type="number"
          step="0.01"
          value={weeklyPaycheck}
          onChange={(e) => setWeeklyPaycheck(e.target.value)}
          className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-5 py-4 text-lg text-white outline-none focus:border-sky-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Pay Frequency
        </label>

        <select
          value={payFrequency}
          onChange={(e) => setPayFrequency(e.target.value)}
          className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-5 py-4 text-lg text-white outline-none focus:border-sky-500"
        >
          <option>Weekly</option>
          <option>Biweekly</option>
          <option>Semi-Monthly</option>
          <option>Monthly</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Next Payday
        </label>

        <select
          value={nextPayday}
          onChange={(e) => setNextPayday(e.target.value)}
          className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-5 py-4 text-lg text-white outline-none focus:border-sky-500"
        >
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
          <option>Sunday</option>
        </select>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-slate-700 bg-slate-800 px-6 py-3 font-semibold text-white hover:bg-slate-700"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-2xl bg-sky-500 px-6 py-3 font-semibold text-white hover:bg-sky-600"
        >
          Save Changes
        </button>
      </div>

    </form>
  );
}