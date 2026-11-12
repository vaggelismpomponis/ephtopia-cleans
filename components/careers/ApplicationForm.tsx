"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { submitApplication } from "@/app/actions/jobs";
import { Input } from "@/components/ui/input";
import { CvUploadField } from "@/components/careers/CvUploadField";

const formSchema = z.object({
  full_name: z.string().min(2, "Το ονοματεπώνυμο είναι υποχρεωτικό"),
  email: z.string().email("Εισάγετε έγκυρο email"),
  phone: z.string().min(8, "Εισάγετε έγκυρο τηλέφωνο"),
  cover_letter: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function ApplicationSuccessPanel({ jobTitle, onReset }: { jobTitle: string; onReset: () => void }) {
  return (
    <div className="py-4 text-center flex flex-col items-center gap-3">
      <CheckCircle2 className="w-7 h-7 text-teal-dark" strokeWidth={1.75} aria-hidden="true" />
      <h3 className="text-lg font-bold text-navy">Η αίτησή σας υποβλήθηκε!</h3>
      <p className="text-sm text-muted leading-relaxed max-w-[36ch]">
        Λάβαμε την αίτησή σας για τη θέση <strong className="text-navy">{jobTitle}</strong>. Θα επικοινωνήσουμε μαζί σας σύντομα.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-2 min-h-10 px-4 py-2 rounded-lg border border-border bg-warm-white hover:bg-white text-sm font-semibold text-navy transition-colors cursor-pointer"
      >
        Υποβολή νέας αίτησης
      </button>
    </div>
  );
}

export function ApplicationForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
  });

  const handleFileSelect = (file: File | null) => {
    setCvError("");
    if (!file) { setCvFile(null); return; }
    if (file.size > 5 * 1024 * 1024) {
      setCvError("Το αρχείο δεν πρέπει να υπερβαίνει τα 5MB");
      return;
    }
    if (!ALLOWED_CV_TYPES.includes(file.type)) {
      setCvError("Επιτρέπονται μόνο αρχεία PDF, DOC και DOCX");
      return;
    }
    setCvFile(file);
  };

  const onSubmit = async (values: FormValues) => {
    setStatus("loading");
    setErrorMsg("");
    const fd = new FormData();
    fd.append("full_name", values.full_name);
    fd.append("email", values.email);
    fd.append("phone", values.phone);
    if (values.cover_letter) fd.append("cover_letter", values.cover_letter);
    if (cvFile) fd.append("cv", cvFile);

    const result = await submitApplication(jobId, fd);
    if (result.success) {
      setStatus("success");
      reset();
      setCvFile(null);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Κάτι πήγε στραβά. Δοκιμάστε ξανά.");
    }
  };

  if (status === "success") {
    return <ApplicationSuccessPanel jobTitle={jobTitle} onReset={() => setStatus("idle")} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="app-full-name" className="block text-sm font-medium text-navy mb-1.5">
          Ονοματεπώνυμο <span className="text-destructive">*</span>
        </label>
        <Input
          id="app-full-name"
          type="text"
          autoComplete="name"
          aria-invalid={!!errors.full_name}
          placeholder="π.χ. Γιώργης Παπαδόπουλος"
          {...register("full_name")}
          className="min-h-11 h-11 bg-white text-navy border-border placeholder:text-muted-light"
        />
        {errors.full_name && <p className="mt-1.5 text-xs text-destructive" role="alert">{errors.full_name.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="app-email" className="block text-sm font-medium text-navy mb-1.5">
            Email <span className="text-destructive">*</span>
          </label>
          <Input
            id="app-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            aria-invalid={!!errors.email}
            placeholder="email@example.com"
            {...register("email")}
            className="min-h-11 h-11 bg-white text-navy border-border placeholder:text-muted-light"
          />
          {errors.email && <p className="mt-1.5 text-xs text-destructive" role="alert">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="app-phone" className="block text-sm font-medium text-navy mb-1.5">
            Τηλέφωνο <span className="text-destructive">*</span>
          </label>
          <Input
            id="app-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            placeholder="69XXXXXXXX"
            {...register("phone")}
            className="min-h-11 h-11 bg-white text-navy border-border placeholder:text-muted-light"
          />
          {errors.phone && <p className="mt-1.5 text-xs text-destructive" role="alert">{errors.phone.message}</p>}
        </div>
      </div>

      <CvUploadField cvFile={cvFile} cvError={cvError} onFileSelect={handleFileSelect} />

      <div>
        <label htmlFor="app-cover-letter" className="block text-sm font-medium text-navy mb-1.5">
          Συνοδευτικό Μήνυμα <span className="text-muted font-normal">(προαιρετικό)</span>
        </label>
        <textarea
          id="app-cover-letter"
          rows={4}
          placeholder="Πείτε μας λίγα λόγια για εσάς..."
          {...register("cover_letter")}
          className="w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted-light focus-visible:border-teal focus-visible:ring-2 focus-visible:ring-teal/20 outline-none resize-none"
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 text-sm text-destructive" role="alert">
          <XCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        id="submit-application-btn"
        className="w-full min-h-11 h-12 rounded-lg bg-teal-dark hover:bg-navy text-white font-semibold px-6 text-sm sm:text-base transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
      >
        {status === "loading" ? (<><Loader2 className="w-4 h-4 animate-spin shrink-0" /><span>Υποβολή...</span></>) : <span>Υποβολή Αίτησης</span>}
      </button>
      <p className="text-xs text-muted text-center">Τα στοιχεία σας θα χρησιμοποιηθούν αποκλειστικά για την αξιολόγηση της αίτησής σας.</p>
    </form>
  );
}
