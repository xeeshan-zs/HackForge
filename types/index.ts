export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  teamSize: string;
  teamMemberLimit: number; // 1-4
  registrationFee: number; // in PKR
  eligibility: string;
  rules: string[];
}

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  location: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PrizeTier {
  first: string;
  second: string;
  third: string;
}

export interface PrizeItem {
  category: string;
  tiers: PrizeTier;
}

export type RegistrationStatus = "pending" | "confirmed" | "rejected";

export interface TeamMember {
  name: string;
  email: string;
}

export interface RegistrationInput {
  fullName: string;
  studentId: string;
  university: string;
  email: string;
  phone: string;
  whatsapp?: string;
  teamName?: string;
  teamSize: "1" | "2" | "3" | "4";
  members: TeamMember[];
  category: string;
  projectIdea?: string;
  agreedToRules: boolean;
  paymentMethod?: string;
  paymentScreenshotId?: string;
  paymentScreenshotUrl?: string;
}

export interface RegistrationRecord extends RegistrationInput {
  id: string;
  createdAt: unknown;
  status: RegistrationStatus;
}

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export interface PaymentMethod {
  id: string;
  name: string; // e.g., "JazzCash", "EasyPaisa", "Bank Transfer"
  accountName: string;
  accountNumber: string;
  reference?: string; // Additional info like branch name
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AdminContactInfo {
  email: string;
  phone: string;
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  updatedAt?: unknown;
}

export interface PrizeConfig {
  categoryId: string;
  first: number;
  second: number;
  third: number;
  bestProject?: number;
  updatedAt?: unknown;
}
