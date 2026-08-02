import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export const defaultCashFlow = {
  checkingBalance: 0,
  savingsBalance: 0,
  weeklyPaycheck: 0,
  nextPayday: "",
  lastMonthlyReset: new Date()
    .toISOString()
    .slice(0, 7),
};

export async function getCashFlow(householdId) {
  const ref = doc(db, "households", householdId);

  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return defaultCashFlow;
  }

  return snapshot.data().cashFlow || defaultCashFlow;
}

export async function saveCashFlow(
  householdId,
  cashFlow
) {
  const ref = doc(db, "households", householdId);

  await setDoc(
    ref,
    {
      cashFlow,
    },
    {
      merge: true,
    }
  );
}