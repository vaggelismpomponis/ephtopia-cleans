"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle, Shield, Clock } from "lucide-react";
import type { SiteContent } from "@/lib/get-content";
import { Input } from "@/components/ui/input";
import { useLivePreview } from "@/components/LivePreviewProvider";

const formSchema = z.object({
  email: z.string().email("Εισάγετε έγκυρο email"),
  phone: z.string().min(10, "Εισάγετε έγκυρο τηλέφωνο (τουλάχιστον 10 ψηφία)"),
  honeypot: z.string().max(0),
});

type LeadFormData = z.infer<typeof formSchema>;

const TRUST_ITEMS = [
  { icon: CheckCircle, text: "Δωρεάν αξιολόγηση χωρίς δεσμεύσεις" },
  { icon: Clock, text: "Απάντηση εντός 24 ωρών" },
  { icon: Shield, text: "Ασφαλής επικοινωνία — χωρίς spam" },
] as const;

function LeadSuccessPanel({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <div className="py-6 text-center flex flex-col items-center gap-3">
      <CheckCircle className="w-7 h-7 text-teal-dark" strokeWidth={1.75} aria-hidden="true" />
      <h3 className="text-xl font-bold text-navy">{message}</h3>
      <p className="text-sm text-muted max-w-[40ch]">
        Ελέγξτε το email σας για περισσότερες λεπτομέρειες.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-2 min-h-10 px-4 py-2 rounded-lg border border-border bg-warm-white hover:bg-white text-sm font-semibold text-navy transition-colors cursor-pointer"
      >
        Νέα αποστολή
      </button>
    </div>
  );
}

export default function LeadForm({ siteContent: initialContent }: { siteContent: SiteContent }) {
  const preview = useLivePreview();
  const content = (preview?.siteContent || initialContent).leadForm;
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<LeadFormData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: { email: "", phone: "", honeypot: "" },
  });

  const onSubmit = (data: LeadFormData) => {
    if (data.honeypot) return;
    setIsSubmitted(true);
    reset();
  };

  return (
    <section id="contact" className="bg-warm-white py-12 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-6 min-w-0">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-3 block">
              Επικοινωνία
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy leading-tight">
              {content.title} — <span className="text-teal-dark">{content.titleAccent}</span>
            </h2>
            <p className="mt-4 text-base text-muted max-w-[48ch] leading-relaxed">{content.subtitle}</p>
            <ul className="mt-8 pt-6 border-t border-border space-y-3">
              {TRUST_ITEMS.map((item) => (
                <li key={item.text} className="flex items-center gap-2.5 text-sm text-navy font-medium">
                  <item.icon className="w-4 h-4 text-teal-dark shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 min-w-0">
            <div className="rounded-xl border border-border bg-white p-6 sm:p-8">
              {isSubmitted ? (
                <LeadSuccessPanel message={content.successMessage} onReset={() => setIsSubmitted(false)} />
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  <div>
                    <label htmlFor="lead-email" className="block text-sm font-medium text-navy mb-1.5">
                      {content.fields.email.label}
                    </label>
                    <Input
                      {...register("email")}
                      id="lead-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      aria-invalid={!!errors.email}
                      placeholder={content.fields.email.placeholder}
                      className="min-h-11 h-11 bg-white text-navy border-border placeholder:text-muted-light"
                    />
                    {errors.email && (
                      <p className="text-destructive text-xs mt-1.5" role="alert">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lead-phone" className="block text-sm font-medium text-navy mb-1.5">
                      {content.fields.phone.label}
                    </label>
                    <Input
                      {...register("phone")}
                      id="lead-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      aria-invalid={!!errors.phone}
                      placeholder={content.fields.phone.placeholder}
                      className="min-h-11 h-11 bg-white text-navy border-border placeholder:text-muted-light"
                    />
                    {errors.phone && (
                      <p className="text-destructive text-xs mt-1.5" role="alert">{errors.phone.message}</p>
                    )}
                  </div>

                  <input {...register("honeypot")} type="text" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-11 h-12 rounded-lg bg-teal-dark hover:bg-navy text-white text-sm sm:text-base font-semibold transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <span>{content.submitCta}</span>
                    <Send className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                  </button>
                  <p className="text-center text-xs text-muted">{content.trustMicroCopy}</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
