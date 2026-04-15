import {
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

export async function signInAdmin(email: string, password: string) {
  const auth = getFirebaseAuth();
  const userCredential: UserCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return userCredential.user;
}

export async function signOutAdmin() {
  const auth = getFirebaseAuth();
  await signOut(auth);
}
