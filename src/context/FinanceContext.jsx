import { createContext, useMemo, useState } from "react";
import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  subscribeToCards,
  addCard as addCardService,
  updateCard as updateCardService,
  deleteCard as deleteCardService,
  recordCardPayment as recordCardPaymentService,
  undoCardPayment as undoCardPaymentService,
} from "../services/cardService";
import {
  getCashFlow,
  saveCashFlow,
  defaultCashFlow,
} from "../services/cashFlowService";
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

  if (!cashFlow.lastMonthlyReset) return;

  if (bills.length === 0 && cards.length === 0) return;

  resetMonthlyIfNeeded();
}, [
  householdId,
  cashFlow.lastMonthlyReset,
  bills,
  cards,
]);

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
  const bill = bills.find(
    (b) => b.id === id
  );

  if (!bill) return;

  const payingBill = !bill.isPaid;

  // Toggle paid status
  await toggleBillPaidService(
    householdId,
    bill
  );

  // Update checking balance
  const newCheckingBalance = payingBill
    ? cashFlow.checkingBalance - bill.amount
    : cashFlow.checkingBalance + bill.amount;

  const updatedCashFlow = {
    ...cashFlow,
    checkingBalance: newCheckingBalance,
  };

  setCashFlow(updatedCashFlow);

  await saveCashFlow(
    householdId,
    updatedCashFlow
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

const paymentAmount =
  Number(paymentData.minimum || 0) +
  Number(paymentData.extra || 0);

  if (paymentAmount <= 0) return;

  const updatedCashFlow = {
    ...cashFlow,
    checkingBalance:
      Number(cashFlow.checkingBalance || 0) -
      paymentAmount,
  };

  setCashFlow(updatedCashFlow);

  await saveCashFlow(
    householdId,
    updatedCashFlow
  );
}
async function undoCardPayment(id) {
  const card = cards.find(
    (c) => c.id === id
  );

  if (!card) return;

  const amount = Number(
    card.lastPaymentAmount || 0
  );

  await undoCardPaymentService(
    householdId,
    card
  );

  const updatedCashFlow = {
    ...cashFlow,
    checkingBalance:
      Number(cashFlow.checkingBalance) +
      amount,
  };

  setCashFlow(updatedCashFlow);

  await saveCashFlow(
    householdId,
    updatedCashFlow
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

async function resetMonthlyIfNeeded() {
  const currentMonth = new Date()
    .toISOString()
    .slice(0, 7);

  if (
    cashFlow.lastMonthlyReset === currentMonth
  ) {
    return;
  }

  // Reset Bills
  await Promise.all(
    bills.map((bill) =>
      updateBillService(householdId, {
        ...bill,
        isPaid: false,
      })
    )
  );

  // Reset Cards
  await Promise.all(
    cards.map((card) =>
      updateCardService(householdId, {
        ...card,
        isPaidThisMonth: false,
        lastPaymentAmount: 0,
        lastPaymentDate: null,
      })
    )
  );

  const updatedCashFlow = {
    ...cashFlow,
    lastMonthlyReset: currentMonth,
  };

  setCashFlow(updatedCashFlow);

  await saveCashFlow(
    householdId,
    updatedCashFlow
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
      undoCardPayment,

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