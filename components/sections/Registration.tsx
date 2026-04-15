"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import { useState, useEffect } from "react";
import { InputHTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { canInitializeFirebase } from "@/lib/firebase";
import { createRegistration, isDuplicateRegistration, getPaymentMethods, getAdminCategories } from "@/lib/firestore";
import { uploadPaymentScreenshot } from "@/lib/appwrite";
import { Category, PaymentMethod } from "@/types";
import toast from "react-hot-toast";

const schema = z.object({
  fullName: z.string().min(2),
  studentId: z.string().min(2),
  university: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  whatsapp: z.string().optional(),
  teamName: z.string().optional(),
  teamSize: z.enum(["1", "2", "3", "4"]),
  member1Name: z.string().optional(),
  member1Email: z.string().optional(),
  member2Name: z.string().optional(),
  member2Email: z.string().optional(),
  member3Name: z.string().optional(),
  member3Email: z.string().optional(),
  member4Name: z.string().optional(),
  member4Email: z.string().optional(),
  category: z.string().min(1),
  projectIdea: z.string().optional(),
  paymentMethod: z.string().optional(),
  agreedToRules: z.boolean().refine((v) => v, "You must agree to the rules."),
});

type FormValues = z.infer<typeof schema>;

const steps = ["Personal Info", "Team Details", "Category & Payment", "Confirm"];

export default function Registration() {
  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState("");
  const [doneId, setDoneId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [adminCategories, setAdminCategories] = useState<Category[]>([]);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>("");
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      studentId: "",
      university: "",
      email: "",
      phone: "",
      whatsapp: "",
      teamName: "",
      teamSize: "1",
      member1Name: "",
      member1Email: "",
      member2Name: "",
      member2Email: "",
      member3Name: "",
      member3Email: "",
      member4Name: "",
      member4Email: "",
      category: "",
      projectIdea: "",
      paymentMethod: "",
      agreedToRules: false,
    },
  });

  const values = form.watch();

  useEffect(() => {
    loadPaymentMethods();
    loadAdminCategories();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const methods = await getPaymentMethods();
      setPaymentMethods(methods);
    } catch (error) {
      console.error("Failed to load payment methods");
    }
  };

  const loadAdminCategories = async () => {
    try {
      const cats = await getAdminCategories();
      setAdminCategories(cats);
    } catch (error) {
      console.error("Failed to load categories");
    }
  };

  const selectedCategory = adminCategories.find(
    (c) => c.name === values.category
  );

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setPaymentScreenshot(file);
      const reader = new FileReader();
      reader.onload = (e) => setScreenshotPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(valuesData: FormValues) {
    setSubmitError("");
    setSubmitting(true);
    try {
      if (!canInitializeFirebase()) {
        setSubmitError("Firebase is not configured yet.");
        return;
      }
      const duplicate = await isDuplicateRegistration(valuesData.email);
      if (duplicate) {
        setSubmitError("This email is already registered.");
        return;
      }

      let paymentScreenshotUrl = "";
      let paymentScreenshotId = "";

      if (paymentScreenshot) {
        setUploadingScreenshot(true);
        try {
          const uploaded = await uploadPaymentScreenshot(paymentScreenshot);
          paymentScreenshotUrl = uploaded.fileUrl;
          paymentScreenshotId = uploaded.fileId;
        } catch (error) {
          setSubmitError("Failed to upload payment screenshot");
          return;
        } finally {
          setUploadingScreenshot(false);
        }
      }

      const members = [];
      for (let i = 1; i <= 4; i++) {
        const nameKey = `member${i}Name` as keyof FormValues;
        const emailKey = `member${i}Email` as keyof FormValues;
        const name = valuesData[nameKey];
        const email = valuesData[emailKey];
        if (typeof name === 'string' && typeof email === 'string' && name && email) {
          members.push({ name, email });
        }
      }

      const id = await createRegistration({
        fullName: valuesData.fullName,
        studentId: valuesData.studentId,
        university: valuesData.university,
        email: valuesData.email,
        phone: valuesData.phone,
        whatsapp: valuesData.whatsapp,
        teamName: valuesData.teamName,
        teamSize: valuesData.teamSize,
        members,
        category: valuesData.category,
        projectIdea: valuesData.projectIdea,
        paymentMethod: valuesData.paymentMethod,
        paymentScreenshotId,
        paymentScreenshotUrl,
        agreedToRules: valuesData.agreedToRules,
      });

      setDoneId(id);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      form.reset();
      setStep(1);
      setPaymentScreenshot(null);
      setScreenshotPreview("");
    } catch (err) {
      setSubmitError("Registration failed. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (doneId) {
    return (
      <section id="register" className="section-container">
        <div className="card-surface rounded-lg p-8 text-center">
          <h2 className="font-display text-3xl text-[var(--color-primary)]">
            Registration Complete
          </h2>
          <p className="mt-3 text-[var(--color-muted)]">
            Your registration ID is <span className="font-semibold text-white">{doneId}</span>.
            Please check your email for follow-up updates.
          </p>
          <button type="button" onClick={() => setDoneId("")} className="primary-btn mt-6">
            Register Another
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="section-container">
      <p className="section-heading">Join HackForge</p>
      <h2 className="section-title">Registration</h2>
      <div className="mt-2 h-1 w-20 rounded-full bg-[var(--color-primary)]" />

      <div className="card-surface mt-8 rounded-lg p-6">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs text-[var(--color-muted)]">
            {steps.map((label, idx) => (
              <span key={label} className={idx + 1 <= step ? "text-white" : ""}>
                {label}
              </span>
            ))}
          </div>
          <div className="h-2 rounded-full bg-black/30">
            <div
              className="h-2 rounded-full bg-[var(--color-primary)] transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {step === 1 && (
            <>
              <Input label="Full Name" {...form.register("fullName")} />
              <Input label="Student ID" {...form.register("studentId")} />
              <Input label="University" {...form.register("university")} />
              <Input label="Email" type="email" {...form.register("email")} />
              <Input label="Phone" {...form.register("phone")} />
              <Input label="WhatsApp (optional)" {...form.register("whatsapp")} />
            </>
          )}

          {step === 2 && (
            <>
              <Input label="Team Name (optional)" {...form.register("teamName")} />
              <label className="block text-sm">
                <span className="mb-1 block text-[var(--color-muted)]">Team Size</span>
                <select
                  {...form.register("teamSize")}
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
                >
                  <option value="1">1 (Solo)</option>
                  <option value="2">2 (Duo)</option>
                  <option value="3">3 (Trio)</option>
                  <option value="4">4 (Squad)</option>
                </select>
              </label>

              {parseInt(values.teamSize) >= 1 && (
                <>
                  <Input label="Member 1 Name" {...form.register("member1Name")} />
                  <Input label="Member 1 Email" type="email" {...form.register("member1Email")} />
                </>
              )}
              {parseInt(values.teamSize) >= 2 && (
                <>
                  <Input label="Member 2 Name" {...form.register("member2Name")} />
                  <Input label="Member 2 Email" type="email" {...form.register("member2Email")} />
                </>
              )}
              {parseInt(values.teamSize) >= 3 && (
                <>
                  <Input label="Member 3 Name" {...form.register("member3Name")} />
                  <Input label="Member 3 Email" type="email" {...form.register("member3Email")} />
                </>
              )}
              {parseInt(values.teamSize) >= 4 && (
                <>
                  <Input label="Member 4 Name" {...form.register("member4Name")} />
                  <Input label="Member 4 Email" type="email" {...form.register("member4Email")} />
                </>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <label className="block text-sm">
                <span className="mb-1 block text-[var(--color-muted)]">Category</span>
                <select
                  {...form.register("category")}
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
                >
                  <option value="">Select category</option>
                  {adminCategories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name} - PKR {category.registrationFee}
                    </option>
                  ))}
                </select>
              </label>

              {selectedCategory && (
                <div className="rounded-md bg-blue-500/10 border border-blue-500/30 p-3 text-sm text-blue-200">
                  <p className="font-semibold mb-1">Category Details:</p>
                  <p>Team Member Limit: {selectedCategory.teamMemberLimit}</p>
                  <p>Registration Fee: PKR {selectedCategory.registrationFee}</p>
                </div>
              )}

              <label className="block text-sm">
                <span className="mb-1 block text-[var(--color-muted)]">
                  Brief Project Idea / Tagline (optional)
                </span>
                <textarea
                  {...form.register("projectIdea")}
                  rows={4}
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block text-[var(--color-muted)]">Select Payment Method</span>
                <select
                  {...form.register("paymentMethod")}
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
                >
                  <option value="">-- Select payment method --</option>
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name} ({method.accountName})
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                <span className="mb-1 block text-[var(--color-muted)]">
                  Upload Payment Screenshot
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotChange}
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
                />
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  Max file size: 5MB. JPG, PNG, or GIF.
                </p>
              </label>

              {screenshotPreview && (
                <div className="mt-2">
                  <img
                    src={screenshotPreview}
                    alt="Payment screenshot preview"
                    className="max-h-32 rounded-md border border-[var(--color-border)]"
                  />
                </div>
              )}
            </>
          )}

          {step === 4 && (
            <div className="space-y-3 text-sm">
              <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 text-[var(--color-muted)]">
                <p>
                  <span className="text-white">Name:</span> {values.fullName}
                </p>
                <p>
                  <span className="text-white">Email:</span> {values.email}
                </p>
                <p>
                  <span className="text-white">University:</span> {values.university}
                </p>
                <p>
                  <span className="text-white">Category:</span> {values.category}
                </p>
                <p>
                  <span className="text-white">Team Size:</span> {values.teamSize}
                </p>
                {values.paymentMethod && (
                  <p>
                    <span className="text-white">Payment Method:</span>{" "}
                    {paymentMethods.find((m) => m.id === values.paymentMethod)?.name}
                  </p>
                )}
                {paymentScreenshot && (
                  <p>
                    <span className="text-white">Payment Screenshot:</span> Uploaded ✓
                  </p>
                )}
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" {...form.register("agreedToRules")} />
                <span>I have read and agree to all HackForge rules.</span>
              </label>
            </div>
          )}

          {submitError ? <p className="text-sm text-red-400">{submitError}</p> : null}

          <div className="flex flex-wrap gap-3 pt-2">
            {step > 1 && (
              <button type="button" className="secondary-btn" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
            )}
            {step < 4 ? (
              <button type="button" className="primary-btn" onClick={() => setStep((s) => s + 1)}>
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="primary-btn"
                disabled={submitting || uploadingScreenshot}
              >
                {submitting || uploadingScreenshot ? "Processing..." : "Submit Registration"}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

function Input({ label, ...props }: InputProps) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-[var(--color-muted)]">{label}</span>
      <input
        {...props}
        className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
      />
    </label>
  );
}
