import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export function subscribeToCards(
  householdId,
  callback
) {
  const cardsRef = collection(
    db,
    "households",
    householdId,
    "cards"
  );

  return onSnapshot(cardsRef, (snapshot) => {
    const cards = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(cards);
  });
}

export async function addCard(
  householdId,
  card
) {
  await addDoc(
    collection(
      db,
      "households",
      householdId,
      "cards"
    ),
    {
      paymentHistory: [],
      isPaidThisMonth: false,
      ...card,
      createdAt: Date.now(),
    }
  );
}

export async function updateCard(
  householdId,
  card
) {
  const { id, ...data } = card;

  await updateDoc(
    doc(
      db,
      "households",
      householdId,
      "cards",
      id
    ),
    data
  );
}

export async function deleteCard(
  householdId,
  cardId
) {
  await deleteDoc(
    doc(
      db,
      "households",
      householdId,
      "cards",
      cardId
    )
  );
}

export async function recordCardPayment(
  householdId,
  card,
  paymentData
) {
  const {
    minimum = 0,
    extra = 0,
  } = paymentData;

  const total =
    Number(minimum) + Number(extra);

  await updateDoc(
    doc(
      db,
      "households",
      householdId,
      "cards",
      card.id
    ),
    {
      balance: Math.max(
        0,
        Number(card.balance) - total
      ),
      isPaidThisMonth:
        paymentData.markPaid ?? true,
      lastPaymentDate: new Date().toISOString(),
      paymentHistory: [
        ...(card.paymentHistory || []),
        {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          minimum: Number(minimum),
          extra: Number(extra),
          total,
        },
      ],
    }
  );
}