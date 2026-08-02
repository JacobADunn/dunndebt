import { createContext, useMemo, useState } from "react";
import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  getCashFlow,
  saveCashFlow,
  defaultCashFlow,
} from "../services/cashFlowService";
import {
  subscribeToCards,
  addCard as addCardService,
  updateCard as updateCardService,
  deleteCard as deleteCardService,
  recordCardPayment as recordCardPaymentService,
} from "../services/cardService";
import {
  subscribeToBills,
  addBill as addBillService,
  updateBill as updateBillService,
  deleteBill as deleteBillService,
  toggleBillPaid as toggleBillPaidService,
} from "../services/billService";
export const FinanceContext = createContext(null);
export function FinanceProvider({ children }) {
  const { householdId } = useAuth();
  const [bills, setBills] = useState([]);
const [cards, setCards] = useState([]);
const [cashFlow, setCashFlow] =
  useState(defaultCashFlow);

  // ------------------------
  // UI State
  // ------------------------

  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const [billModalOpen, setBillModalOpen] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);

  useEffect(() => {
        if (!householdId) return;

        const unsubscribe = subscribeToBills(
          householdId,
          setBills
        );
      return unsubscribe;
    }, [householdId]);

useEffect(() => {
  if (!householdId) return;

  const unsubscribe = subscribeToCards(
    householdId,
    setCards
  );

  return unsubscribe;
}, [householdId]);

  useEffect(() => {
  if (!householdId) return;

  
  async function loadCashFlow() {
    const data = await getCashFlow(householdId);

    setCashFlow(data);
  }

  loadCashFlow();
}, [householdId]);

  // ------------------------
  // Bills
  // ------------------------

    async function addBill(bill) {
      await addBillService(householdId, bill);
    }

    async function updateBill(bill) {
      await updateBillService(householdId, bill);
    }

    async function deleteBill(id) {
      await deleteBillService(householdId, id);
    }

    async function toggleBillPaid(id) {
      const bill = bills.find((b) => b.id === id);

      if (!bill) return;

      await toggleBillPaidService(
        householdId,
        bill
      );
    }

  // ------------------------
  // Credit Cards
  // ------------------------

  async function addCard(card) {
  await addCardService(
    householdId,
    card
  );
}

async function updateCard(card) {
  await updateCardService(
    householdId,
    card
  );
}

async function deleteCard(id) {
  await deleteCardService(
    householdId,
    id
  );
}

async function recordCardPayment(
  id,
  paymentData
) {
  const card = cards.find(
    (c) => c.id === id
  );

  if (!card) return;

  await recordCardPaymentService(
    householdId,
    card,
    paymentData
  );
}

  // ------------------------
  // Cash Flow
  // ------------------------

async function updateCashFlow(data) {
  const updated = {
    ...cashFlow,
    ...data,
  };

  setCashFlow(updated);
  await saveCashFlow(
    householdId,
    updated
  );
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
    console.warn(
      "Reset bills not implemented for Firestore yet."
    );
    console.warn(
      "Reset cards not implemented yet."
    );
    setCashFlow(defaultCashFlow);

      if (householdId) {
        saveCashFlow(
          householdId,
          defaultCashFlow
        );
      }
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