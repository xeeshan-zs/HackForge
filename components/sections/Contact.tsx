"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { canInitializeFirebase } from "@/lib/firebase";
import { createContactMessage } from "@/lib/firestore";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

const contacts = [
  ["Email", "hackforge@acm-numl.com"],
  ["WhatsApp Group", "#"],
  ["Instagram", "@acm_numl_lahore"],
  ["LinkedIn", "ACM Chapter NUML Lahore"],
  ["Address", "NUML Lahore Campus"],
];

export default function Contact() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", message: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      if (!canInitializeFirebase()) {
        toast.error("Firebase is not configured yet.");
        return;
      }
      await createContactMessage(values);
      toast.success("Message sent successfully.");
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message.");
    }
  }

  return (
    <section id="contact" className="section-container">
      <p className="section-heading">Connect</p>
      <h2 className="section-title">Contact & Socials</h2>
      <div className="mt-2 h-1 w-20 rounded-full bg-[var(--color-primary)]" />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          {contacts.map(([label, value]) => (
            <div key={label} className="card-surface rounded-md p-4">
              <p className="text-xs uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
              <p className="mt-1 text-sm">{value}</p>
            </div>
          ))}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="card-surface rounded-lg p-5">
          <label className="mb-3 block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">Name</span>
            <input
              {...form.register("name")}
              className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
            />
          </label>
          <label className="mb-3 block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">Email</span>
            <input
              type="email"
              {...form.register("email")}
              className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
            />
          </label>
          <label className="mb-3 block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">Message</span>
            <textarea
              rows={5}
              {...form.register("message")}
              className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
            />
          </label>
          <button type="submit" className="primary-btn">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
