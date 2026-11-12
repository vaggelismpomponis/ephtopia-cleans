'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Loader2, Save } from 'lucide-react';
import type { Job } from '@/lib/types/jobs';

const formSchema = z.object({
  title: z.string().min(2, 'Ο τίτλος είναι υποχρεωτικός'),
  description: z.string().min(10, 'Η περιγραφή είναι υποχρεωτική'),
  location: z.string().min(2, 'Η τοποθεσία είναι υποχρεωτική'),
  employment_type: z.enum(['full-time', 'part-time', 'contract']),
  department: z.string().min(2, 'Το τμήμα είναι υποχρεωτικό'),
  salary_range: z.string().optional(),
  requirements: z.array(z.object({ value: z.string().min(1, 'Συμπληρώστε ή αφαιρέστε αυτό το πεδίο') })).min(1, 'Προσθέστε τουλάχιστον μία απαίτηση'),
  responsibilities: z.array(z.object({ value: z.string().min(1, 'Συμπληρώστε ή αφαιρέστε αυτό το πεδίο') })).min(1, 'Προσθέστε τουλάχιστον μία αρμοδιότητα'),
  benefits: z.array(z.object({ value: z.string() })),
  contact_email: z.string().email('Εισάγετε έγκυρο email'),
  deadline: z.string().optional(),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface JobFormProps {
  initialData?: Job;
  onSubmit: (data: {
    title: string;
    description: string;
    location: string;
    employment_type: 'full-time' | 'part-time' | 'contract';
    department: string;
    salary_range?: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    contact_email: string;
    deadline?: string;
    is_active: boolean;
  }) => Promise<{ success: boolean; error?: string; id?: string }>;
  submitLabel?: string;
}

const departments = [
  'Καθαρισμός',
  'Αλλαγή Κλινοσκεπασμάτων',
  'Επίβλεψη / Συντονισμός',
  'Διοίκηση',
  'Εξυπηρέτηση Πελατών',
  'Λογιστήριο',
  'Πληροφορική',
  'Άλλο',
];

function FieldCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-border rounded-xl p-4 sm:p-6 w-full">
      <h3 className="text-xs font-bold text-teal-dark uppercase tracking-widest mb-4 pb-3 border-b border-border">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FormField({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy mb-1.5">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive" role="alert">{error}</p>}
    </div>
  );
}

const inputCls =
  'w-full min-h-11 border border-border rounded-lg px-3.5 py-2.5 text-sm text-navy placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-colors bg-white';

export function JobForm({ initialData, onSubmit, submitLabel = 'Αποθήκευση' }: JobFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toFieldArray = (arr: string[]) => arr.map((v) => ({ value: v }));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      location: initialData?.location ?? '',
      employment_type: initialData?.employment_type ?? 'full-time',
      department: initialData?.department ?? departments[0],
      salary_range: initialData?.salary_range ?? '',
      requirements: toFieldArray(initialData?.requirements ?? ['']),
      responsibilities: toFieldArray(initialData?.responsibilities ?? ['']),
      benefits: toFieldArray(initialData?.benefits ?? []),
      contact_email: initialData?.contact_email ?? '',
      deadline: initialData?.deadline ?? '',
      is_active: initialData?.is_active ?? true,
    },
  });

  const requirementsField = useFieldArray({ control, name: 'requirements' });
  const responsibilitiesField = useFieldArray({ control, name: 'responsibilities' });
  const benefitsField = useFieldArray({ control, name: 'benefits' });

  const handleFormSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setServerError('');
    const result = await onSubmit({
      ...values,
      salary_range: values.salary_range || undefined,
      deadline: values.deadline || undefined,
      requirements: values.requirements.map((r) => r.value).filter(Boolean),
      responsibilities: values.responsibilities.map((r) => r.value).filter(Boolean),
      benefits: values.benefits.map((b) => b.value).filter(Boolean),
    });
    setIsSubmitting(false);
    if (result.success) {
      router.push('/admin/jobs');
      router.refresh();
    } else {
      setServerError(result.error ?? 'Σφάλμα κατά την αποθήκευση');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-4">
      {/* Basic Info */}
      <FieldCard title="Βασικά Στοιχεία">
        <FormField label="Τίτλος Θέσης" error={errors.title?.message} required>
          <input {...register('title')} placeholder="π.χ. Επαγγελματίας Καθαρισμού" className={inputCls} />
        </FormField>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Τμήμα" error={errors.department?.message} required>
            <select {...register('department')} className={inputCls}>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </FormField>
          <FormField label="Τύπος Απασχόλησης" error={errors.employment_type?.message} required>
            <select {...register('employment_type')} className={inputCls}>
              <option value="full-time">Πλήρης Απασχόληση</option>
              <option value="part-time">Μερική Απασχόληση</option>
              <option value="contract">Σύμβαση</option>
            </select>
          </FormField>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Τοποθεσία" error={errors.location?.message} required>
            <input {...register('location')} placeholder="π.χ. Αθήνα" className={inputCls} />
          </FormField>
          <FormField label="Εύρος Μισθού" error={errors.salary_range?.message}>
            <input {...register('salary_range')} placeholder="π.χ. €800 - €1.200/μήνα" className={inputCls} />
          </FormField>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Email Επικοινωνίας" error={errors.contact_email?.message} required>
            <input {...register('contact_email')} type="email" inputMode="email" autoCapitalize="none" placeholder="hr@ephtopia.eu" className={inputCls} />
          </FormField>
          <FormField label="Προθεσμία Αίτησης" error={errors.deadline?.message}>
            <input {...register('deadline')} type="date" className={inputCls} />
          </FormField>
        </div>

        <FormField label="Περιγραφή Θέσης" error={errors.description?.message} required>
          <textarea
            {...register('description')}
            rows={5}
            placeholder="Περιγράψτε τη θέση εργασίας..."
            className={`${inputCls} resize-none`}
          />
        </FormField>

        {/* Active toggle */}
        <div className="flex items-center gap-3 pt-1">
          <input
            {...register('is_active')}
            type="checkbox"
            id="is-active-toggle"
            className="w-4 h-4 accent-teal rounded"
          />
          <label htmlFor="is-active-toggle" className="text-sm font-semibold text-slate-700 cursor-pointer">
            Ενεργή αγγελία (εμφανίζεται στο site)
          </label>
        </div>
      </FieldCard>

      {/* Dynamic lists helper */}
      {(
        [
          { field: responsibilitiesField, label: 'Αρμοδιότητες', name: 'responsibilities', error: errors.responsibilities?.message, placeholder: 'π.χ. Καθαρισμός δωματίων' },
          { field: requirementsField, label: 'Απαιτήσεις / Προσόντα', name: 'requirements', error: errors.requirements?.message, placeholder: 'π.χ. Εμπειρία σε καθαρισμό' },
          { field: benefitsField, label: 'Παροχές (προαιρετικό)', name: 'benefits', error: undefined, placeholder: 'π.χ. Ασφάλιση, bonus' },
        ] as const
      ).map(({ field, label, name, error, placeholder }) => (
        <FieldCard key={name} title={label}>
          {error && <p className="text-xs text-red-500 -mt-2 mb-2">{error}</p>}
          <div className="space-y-2">
            {field.fields.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  {...register(`${name}.${index}.value` as Parameters<typeof register>[0])}
                  placeholder={placeholder}
                  className={`${inputCls} flex-1`}
                />
                {field.fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => field.remove(index)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                    aria-label="Αφαίρεση"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => field.append({ value: '' })}
            className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-teal hover:text-teal-dark transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Προσθήκη
          </button>
        </FieldCard>
      ))}

      {/* Server error */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="min-h-11 px-5 py-2.5 rounded-lg border border-border bg-white text-sm font-semibold text-muted hover:text-navy hover:border-navy/40 transition-colors cursor-pointer"
        >
          Ακύρωση
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-11 inline-flex items-center justify-center gap-2 bg-teal-dark hover:bg-navy text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" strokeWidth={1.75} />}
          <span>{submitLabel}</span>
        </button>
      </div>
    </form>
  );
}
