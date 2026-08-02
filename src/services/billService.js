import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export function subscribeToBills(
  householdId,
  callback
) {
  const billsRef = collection(
    db,
    "households",
    householdId,
    "bills"
  );

  return onSnapshot(billsRef, (snapshot) => {
    const bills = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(bills);
  });
}

export async function addBill(
  householdId,
  bill
) {
  await addDoc(
    collection(
      db,
      "households",
      householdId,
      "bills"
    ),
    {
      isPaid: false,
      autoPay: false,
      notes: "",
      ...bill,
      createdAt: Date.now(),
    }
  );
}

export async function updateBill(
  householdId,
  bill
) {
  const { id, ...data } = bill;

  await updateDoc(
    doc(
      db,
      "households",
      householdId,
      "bills",
      id
    ),
    data
  );
}

export async function deleteBill(
  householdId,
  billId
) {
  await deleteDoc(
    doc(
      db,
      "households",
      householdId,
      "bills",
      billId
    )
  );
}

export async function toggleBillPaid(
  householdId,
  bill
) {
  await updateDoc(
    doc(
      db,
      "households",
      householdId,
      "bills",
      bill.id
    ),
    {
      isPaid: !bill.isPaid,
    }
  );
}

import { writeBatch } from "firebase/firestore";

export async function importBills(
  householdId,
  bills
) {
  const batch = writeBatch(db);

  for (const bill of bills) {
    const { id, ...data } = bill;

    batch.set(
      doc(
        db,
        "households",
        householdId,
        "bills",
        id
      ),
      data
    );
  }

  await batch.commit();
}

