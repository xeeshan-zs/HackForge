import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  AdminContactInfo,
  Category,
  ContactInput,
  PaymentMethod,
  PrizeConfig,
  RegistrationInput,
  RegistrationRecord,
  RegistrationStatus,
} from "@/types";
import { getFirebaseDb } from "@/lib/firebase";

export async function isDuplicateRegistration(email: string) {
  const db = getFirebaseDb();
  const q = query(
    collection(db, "registrations"),
    where("email", "==", email.trim().toLowerCase()),
    limit(1),
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

export async function createRegistration(input: RegistrationInput) {
  const db = getFirebaseDb();
  const payload = {
    ...input,
    email: input.email.trim().toLowerCase(),
    createdAt: serverTimestamp(),
    status: "pending" as RegistrationStatus,
  };
  const ref = await addDoc(collection(db, "registrations"), payload);
  return ref.id;
}

export async function createContactMessage(input: ContactInput) {
  const db = getFirebaseDb();
  await addDoc(collection(db, "contacts"), {
    ...input,
    email: input.email.trim().toLowerCase(),
    createdAt: serverTimestamp(),
  });
}

export async function isAdminEmail(email: string) {
  const db = getFirebaseDb();
  const adminRef = doc(db, "admins", email.trim().toLowerCase());
  const snapshot = await getDoc(adminRef);
  return snapshot.exists();
}

export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus,
) {
  const db = getFirebaseDb();
  const ref = doc(db, "registrations", id);
  await updateDoc(ref, { status });
}

export async function getAllRegistrations(): Promise<RegistrationRecord[]> {
  const db = getFirebaseDb();
  const snapshot = await getDocs(collection(db, "registrations"));
  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...(docItem.data() as Omit<RegistrationRecord, "id">),
  }));
}

// ============= ADMIN PAYMENT METHODS =============

export async function addPaymentMethod(
  method: Omit<PaymentMethod, "id" | "createdAt">
): Promise<string> {
  const db = getFirebaseDb();
  const ref = await addDoc(collection(db, "paymentMethods"), {
    ...method,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const db = getFirebaseDb();
  const snapshot = await getDocs(
    query(collection(db, "paymentMethods"), where("isActive", "==", true))
  );
  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...(docItem.data() as Omit<PaymentMethod, "id">),
  }));
}

export async function getAllPaymentMethods(): Promise<PaymentMethod[]> {
  const db = getFirebaseDb();
  const snapshot = await getDocs(collection(db, "paymentMethods"));
  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...(docItem.data() as Omit<PaymentMethod, "id">),
  }));
}

export async function updatePaymentMethod(
  id: string,
  updates: Partial<PaymentMethod>
): Promise<void> {
  const db = getFirebaseDb();
  const ref = doc(db, "paymentMethods", id);
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePaymentMethod(id: string): Promise<void> {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, "paymentMethods", id));
}

// ============= ADMIN CONTACT INFO =============

export async function getAdminContactInfo(): Promise<AdminContactInfo | null> {
  const db = getFirebaseDb();
  const ref = doc(db, "adminConfig", "contactInfo");
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? (snapshot.data() as AdminContactInfo) : null;
}

export async function updateAdminContactInfo(
  info: AdminContactInfo
): Promise<void> {
  const db = getFirebaseDb();
  const ref = doc(db, "adminConfig", "contactInfo");
  await updateDoc(ref, {
    ...info,
    updatedAt: serverTimestamp(),
  });
}

// ============= ADMIN CATEGORIES =============

export async function getAdminCategories(): Promise<Category[]> {
  const db = getFirebaseDb();
  const snapshot = await getDocs(collection(db, "adminCategories"));
  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...(docItem.data() as Omit<Category, "id">),
  }));
}

export async function updateAdminCategory(
  id: string,
  updates: Partial<Category>
): Promise<void> {
  const db = getFirebaseDb();
  const ref = doc(db, "adminCategories", id);
  await updateDoc(ref, updates);
}

// ============= ADMIN PRIZES =============

export async function getAdminPrizes(): Promise<PrizeConfig[]> {
  const db = getFirebaseDb();
  const snapshot = await getDocs(collection(db, "adminPrizes"));
  return snapshot.docs.map((docItem) => ({
    ...docItem.data() as PrizeConfig,
  }));
}

export async function updateAdminPrizes(
  categoryId: string,
  prizes: PrizeConfig
): Promise<void> {
  const db = getFirebaseDb();
  const ref = doc(db, "adminPrizes", categoryId);
  await updateDoc(ref, {
    ...prizes,
    updatedAt: serverTimestamp(),
  });
}
