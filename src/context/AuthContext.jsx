import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../firebase/firebase";
import {
  createUserDocument,
  getUserDocument,
} from "../services/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";


export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const [householdId, setHouseholdId] = useState(null);

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(
    auth,
    async (user) => {
      setCurrentUser(user);

      if (user) {
        const userDoc = await getUserDocument(user.uid);

        if (userDoc) {
          setHouseholdId(userDoc.householdId);
        }
      } else {
        setHouseholdId(null);
      }

      setLoading(false);
    }
  );

  return unsubscribe;
}, []);

    async function signup(email, password) {
    const result =
        await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

  await createUserDocument(result.user);

  return result;
}

  function login(email, password) {
    return signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  }

  function logout() {
    return signOut(auth);
  }

const value = {
  currentUser,
  householdId,
  signup,
  login,
  logout,
};

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}