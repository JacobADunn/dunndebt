import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { generateInviteCode } from "../utils/inviteCode";

// =====================================
// Users
// =====================================

export async function getUserDocument(uid) {
  const snapshot = await getDoc(
    doc(db, "users", uid)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
}

export async function createUserDocument(user) {
  const userRef = doc(
    db,
    "users",
    user.uid
  );

  const existing = await getDoc(userRef);

  if (existing.exists()) {
    return;
  }

  const householdId = crypto.randomUUID();

  const inviteCode = generateInviteCode();

  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    householdId,
    createdAt: Date.now(),
  });

  await setDoc(
    doc(
      db,
      "households",
      householdId
    ),
    {
      name: "My Household",
      inviteCode,
      createdAt: Date.now(),
    }
  );
}

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
    throw new Error(
      "Invalid invite code."
    );
  }

  const household =
    snapshot.docs[0];

  await setDoc(
    doc(
      db,
      "users",
      user.uid
    ),
    {
      uid: user.uid,
      email: user.email,
      householdId: household.id,
      createdAt: Date.now(),
    }
  );
}

// =====================================
// Household
// =====================================

export async function getHousehold(
  householdId
) {
  const snapshot = await getDoc(
    doc(
      db,
      "households",
      householdId
    )
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function updateHouseholdName(
  householdId,
  name
) {
  await updateDoc(
    doc(
      db,
      "households",
      householdId
    ),
    {
      name: name.trim(),
    }
  );
}

// =====================================
// Members
// =====================================

export async function getHouseholdMembers(
  householdId
) {
  const q = query(
    collection(db, "users"),
    where(
      "householdId",
      "==",
      householdId
    )
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

