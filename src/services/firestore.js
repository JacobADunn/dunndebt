import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { generateInviteCode } from "../utils/inviteCode";

// -------------------------
// Get User
// -------------------------

export async function getUserDocument(uid) {
  const snapshot = await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
}

// -------------------------
// Create New User + Household
// -------------------------

export async function createUserDocument(user) {
  console.log("Creating Firestore user...");

  const userRef = doc(db, "users", user.uid);

  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    console.log("User already exists.");
    return;
  }

  const householdId = crypto.randomUUID();
  const inviteCode = generateInviteCode();

  console.log("Writing user document...");

  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    householdId,
    createdAt: Date.now(),
  });

  console.log("Writing household document...");

  await setDoc(doc(db, "households", householdId), {
    name: "My Household",
    inviteCode,
    createdAt: Date.now(),
  });

  console.log("Done!");
}

// -------------------------
// Join Existing Household
// -------------------------

export async function joinHousehold(
  user,
  inviteCode
) {
  const q = query(
    collection(db, "households"),
    where(
      "inviteCode",
      "==",
      inviteCode.trim().toUpperCase()
    )
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("Invalid invite code.");
  }

  const household = snapshot.docs[0];

  const householdId = household.id;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    householdId,
    createdAt: Date.now(),
  });

  console.log("Joined household:", householdId);
}
export async function getHousehold(householdId) {
  const snapshot = await getDoc(
    doc(db, "households", householdId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}