import { createContext, useMemo, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

import { defaultBills } from "../data/defaultBills";
import { defaultCards } from "../data/defaultCards";

export const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const [bills, setBills] = useLocalStorage(
    "cc-bills",
    defaultBills
  );

  const [cards, setCards] = useLocalStorage(
    "cc-cards",
    defaultCards
  );

  const [cashFlow, setCashFlow] = useLocalStorage(
    "cc-cashflow",
    {
      checkingBalance: 0,
      weeklyPaycheck: 0,
      payFrequency: "Weekly",
      nextPayday: "Friday",
    }
  );

  // ------------------------
  // UI State
  // ------------------------

  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const [billModalOpen, setBillModalOpen] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);

  // ------------------------
  // Bills
  // ------------------------

  function addBill(bill) {
    setBills((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        isPaid: false,
        autoPay: false,
        notes: "",
        ...bill,
      },
    ]);
  }

  function updateBill(updatedBill) {
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === updatedBill.id ? updatedBill : bill
      )
    );
  }

  function deleteBill(id) {
    setBills((prev) =>
      prev.filter((bill) => bill.id !== id)
    );
  }

  function toggleBillPaid(id) {
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === id
          ? {
              ...bill,
              isPaid: !bill.isPaid,
            }
          : bill
      )
    );
  }

  // ------------------------
  // Credit Cards
  // ------------------------

  function addCard(card) {
    setCards((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        paymentHistory: [],
        isPaidThisMonth: false,
        ...card,
      },
    ]);
  }

  function updateCard(updatedCard) {
    setCards((prev) =>
      prev.map((card) =>
        card.id === updatedCard.id
          ? updatedCard
          : card
      )
    );
  }

  function deleteCard(id) {
    setCards((prev) =>
      prev.filter((card) => card.id !== id)
    );
  }

  function recordCardPayment(id, paymentData) {
    const {
      minimum = 0,
      extra = 0,
      total = Number(minimum) + Number(extra),
      markPaid = true,
    } = paymentData;

    setCards((prev) =>
      prev.map((card) => {
        if (card.id !== id) return card;

        return {
          ...card,
          balance: Math.max(
            0,
            Number(card.balance) - Number(total)
          ),
          isPaidThisMonth: markPaid,
          lastPaymentDate: new Date().toISOString(),
          paymentHistory: [
            ...(card.paymentHistory || []),
            {
              id: crypto.randomUUID(),
              date: new Date().toISOString(),
              minimum: Number(minimum),
              extra: Number(extra),
              total: Number(total),
            },
          ],
        };
      })
    );
  }

  // ------------------------
  // Cash Flow
  // ------------------------

  function updateCashFlow(data) {
    setCashFlow((prev) => ({
      ...prev,
      ...data,
    }));
  }

  // ------------------------
  // Dashboard Calculations
  // ------------------------

  const totalDebt = cards.reduce(
    (sum, card) => sum + Number(card.balance || 0),
    0
  );

  const totalBills = bills.reduce(
    (sum, bill) => sum + Number(bill.amount || 0),
    0
  );

  const totalMinimumPayments = cards.reduce(
    (sum, card) =>
      sum + Number(card.minimumPayment || 0),
    0
  );

  const totalCreditLimit = cards.reduce(
    (sum, card) =>
      sum + Number(card.creditLimit || 0),
    0
  );

  const utilization =
    totalCreditLimit === 0
      ? 0
      : Math.round(
          (totalDebt / totalCreditLimit) * 100
        );

  // ------------------------
  // Reset
  // ------------------------

  function resetFinanceData() {
    setBills(defaultBills);
    setCards(defaultCards);

    setCashFlow({
      checkingBalance: 0,
      weeklyPaycheck: 0,
      payFrequency: "Weekly",
      nextPayday: "Friday",
    });
  }

  // ------------------------
  // Context
  // ------------------------

  const value = useMemo(
    () => ({
      // Data
      bills,
      cards,
      cashFlow,

      // Bills
      addBill,
      updateBill,
      deleteBill,
      toggleBillPaid,

      // Cards
      addCard,
      updateCard,
      deleteCard,
      recordCardPayment,

      // Cash Flow
      updateCashFlow,

      // Dashboard
      totalDebt,
      totalBills,
      totalMinimumPayments,
      totalCreditLimit,
      utilization,

      // Selected
      selectedBill,
      setSelectedBill,

      selectedCard,
      setSelectedCard,

      // Modals
      billModalOpen,
      setBillModalOpen,

      cardModalOpen,
      setCardModalOpen,

      // Utilities
      resetFinanceData,
    }),
    [
      bills,
      cards,
      cashFlow,
      selectedBill,
      selectedCard,
      billModalOpen,
      cardModalOpen,
      totalDebt,
      totalBills,
      totalMinimumPayments,
      totalCreditLimit,
      utilization,
    ]
  );

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}