import {
  doc,
  setDoc,
  getDoc,
  collection,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

// ...createUserDocument()

export async function getUserDocument(uid) {
  const snapshot = await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
}

export async function createUserDocument(user) {
  console.log("Creating Firestore user...");

  const userRef = doc(db, "users", user.uid);

  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    console.log("User already exists.");
    return;
  }

  const householdId = crypto.randomUUID();

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
    createdAt: Date.now(),
  });

  console.log("Done!");
}