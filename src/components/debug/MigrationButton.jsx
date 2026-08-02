import Button from "../ui/Button";
import useFinance from "../../hooks/useFinance";

export default function MigrationButton() {
  const finance = useFinance();

  async function migrate() {
    if (
      !window.confirm(
        "Import local data into Firestore?"
      )
    ) {
      return;
    }

    // Bills
    const bills = JSON.parse(
      localStorage.getItem("cc-bills") || "[]"
    );

    for (const bill of bills) {
      await finance.addBill(bill);
    }

    // Cards
    const cards = JSON.parse(
      localStorage.getItem("cc-cards") || "[]"
    );

    for (const card of cards) {
      await finance.addCard(card);
    }

    // Cash Flow
    const cashFlow = JSON.parse(
      localStorage.getItem("cc-cashflow") || "{}"
    );

    await finance.updateCashFlow(cashFlow);

    alert("Migration complete!");
  }

  return (
    <Button
      variant="secondary"
      onClick={migrate}
    >
      Import Local Data
    </Button>
  );
}