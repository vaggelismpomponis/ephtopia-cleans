'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';

import type {
  Job,
  JobApplication,
  JobWithApplicationCount,
  ApplicationStatus,
  ActionResult,
} from '@/lib/types/jobs';

// ──────────────────────────────────────────────────────────────
// Validation schemas
// ──────────────────────────────────────────────────────────────

const JobSchema = z.object({
  title: z.string().min(2, 'Ο τίτλος είναι υποχρεωτικός'),
  description: z.string().min(10, 'Η περιγραφή είναι υποχρεωτική'),
  location: z.string().min(2, 'Η τοποθεσία είναι υποχρεωτική'),
  employment_type: z.enum(['full-time', 'part-time', 'contract']),
  department: z.string().min(2, 'Το τμήμα είναι υποχρεωτικό'),
  salary_range: z.string().optional(),
  requirements: z.array(z.string().min(1)).min(1, 'Προσθέστε τουλάχιστον μία απαίτηση'),
  responsibilities: z.array(z.string().min(1)).min(1, 'Προσθέστε τουλάχιστον μία αρμοδιότητα'),
  benefits: z.array(z.string().min(1)),
  contact_email: z.string().email('Εισάγετε έγκυρο email'),
  deadline: z.string().optional(),
  is_active: z.boolean().default(true),
});

const ApplicationSchema = z.object({
  full_name: z.string().min(2, 'Το ονοματεπώνυμο είναι υποχρεωτικό'),
  email: z.string().email('Εισάγετε έγκυρο email'),
  phone: z.string().min(8, 'Εισάγετε έγκυρο τηλέφωνο'),
  cover_letter: z.string().optional(),
});

// ──────────────────────────────────────────────────────────────
// PUBLIC: Fetch active jobs
// ──────────────────────────────────────────────────────────────

export async function getActiveJobs(): Promise<Job[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as Job[];
}

// ──────────────────────────────────────────────────────────────
// PUBLIC: Fetch a single job by id
// ──────────────────────────────────────────────────────────────

export async function getJob(id: string): Promise<Job | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return null;
  return data as Job;
}

// ──────────────────────────────────────────────────────────────
// ADMIN: Fetch all jobs (including inactive) with application counts
// ──────────────────────────────────────────────────────────────

export async function getAllJobs(): Promise<JobWithApplicationCount[]> {
  await requireAdmin();

  // Use service-role to bypass the RLS "only active" policy for public reads
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from('jobs')
    .select('*, job_applications(count)')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((row: Job & { job_applications: { count: number }[] }) => ({
    ...row,
    application_count: row.job_applications?.[0]?.count ?? 0,
  })) as JobWithApplicationCount[];
}

// ──────────────────────────────────────────────────────────────
// ADMIN: Fetch a single job for editing (all fields, any status)
// ──────────────────────────────────────────────────────────────

export async function getJobForEdit(id: string): Promise<Job | null> {
  await requireAdmin();
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from('jobs')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Job;
}

// ──────────────────────────────────────────────────────────────
// ADMIN: Create job
// ──────────────────────────────────────────────────────────────

export async function createJob(
  payload: z.infer<typeof JobSchema>
): Promise<ActionResult> {
  const user = await requireAdmin();
  const parsed = JobSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from('jobs')
    .insert({
      ...parsed.data,
      salary_range: parsed.data.salary_range || null,
      deadline: parsed.data.deadline || null,
      created_by: user.id,
    })
    .select('id')
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath('/careers');
  revalidatePath('/admin/jobs');
  return { success: true, id: data.id };
}

// ──────────────────────────────────────────────────────────────
// ADMIN: Update job
// ──────────────────────────────────────────────────────────────

export async function updateJob(
  id: string,
  payload: z.infer<typeof JobSchema>
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = JobSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from('jobs')
    .update({
      ...parsed.data,
      salary_range: parsed.data.salary_range || null,
      deadline: parsed.data.deadline || null,
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/careers');
  revalidatePath(`/careers/${id}`);
  revalidatePath('/admin/jobs');
  return { success: true };
}

// ──────────────────────────────────────────────────────────────
// ADMIN: Toggle job active/inactive
// ──────────────────────────────────────────────────────────────

export async function toggleJobActive(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  await requireAdmin();
  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from('jobs')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/careers');
  revalidatePath('/admin/jobs');
  return { success: true };
}

// ──────────────────────────────────────────────────────────────
// ADMIN: Delete job
// ──────────────────────────────────────────────────────────────

export async function deleteJob(id: string): Promise<ActionResult> {
  await requireAdmin();
  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from('jobs')
    .delete()
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/careers');
  revalidatePath('/admin/jobs');
  return { success: true };
}

// ──────────────────────────────────────────────────────────────
// ADMIN: Get applications for a job
// ──────────────────────────────────────────────────────────────

function greekToLatin(text: string): string {
  const map: Record<string, string> = {
    'α': 'a', 'ά': 'a', 'Α': 'A', 'Ά': 'A',
    'β': 'v', 'Β': 'V',
    'γ': 'g', 'Γ': 'G',
    'δ': 'd', 'Δ': 'D',
    'ε': 'e', 'έ': 'e', 'Ε': 'E', 'Έ': 'E',
    'ζ': 'z', 'Ζ': 'Z',
    'η': 'i', 'ή': 'i', 'Η': 'I', 'Ή': 'I',
    'θ': 'th', 'Θ': 'Th',
    'ι': 'i', 'ί': 'i', 'ϊ': 'i', 'ΐ': 'i', 'Ι': 'I', 'Ί': 'I',
    'κ': 'k', 'Κ': 'K',
    'λ': 'l', 'Λ': 'L',
    'μ': 'm', 'Μ': 'M',
    'ν': 'n', 'Ν': 'N',
    'ξ': 'x', 'Ξ': 'X',
    'ο': 'o', 'ό': 'o', 'Ο': 'O', 'Ό': 'O',
    'π': 'p', 'Π': 'P',
    'ρ': 'r', 'Ρ': 'R',
    'σ': 's', 'ς': 's', 'Σ': 'S',
    'τ': 't', 'Τ': 'T',
    'υ': 'y', 'ύ': 'y', 'ϋ': 'y', 'ΰ': 'y', 'Υ': 'Y', 'Ύ': 'Y',
    'φ': 'f', 'Φ': 'F',
    'χ': 'ch', 'Χ': 'Ch',
    'ψ': 'ps', 'Ψ': 'Ps',
    'ω': 'o', 'ώ': 'o', 'Ω': 'O', 'Ώ': 'O',
  };
  return text
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '');
}

export async function getApplications(jobId?: string): Promise<JobApplication[]> {
  await requireAdmin();
  const adminClient = createAdminClient();

  let query = adminClient
    .from('job_applications')
    .select('*, jobs(title)')
    .order('submitted_at', { ascending: false });

  if (jobId && jobId !== 'all') {
    query = query.eq('job_id', jobId);
  }

  const { data, error } = await query;

  if (error || !data) return [];

  // Generate signed URLs for CV downloads (valid for 1 hour)
  type JobApplicationRow = JobApplication & { jobs?: { title?: string } | null };
  const applications = await Promise.all(
    (data as JobApplicationRow[]).map(async (row) => {
      const app: JobApplication = {
        ...row,
        job_title: row.jobs?.title,
      };

      if (!app.cv_url) return app;

      // If it's already a full HTTP URL (legacy) or path
      const path = app.cv_url.startsWith('http')
        ? app.cv_url.split('/job-applications/').pop()
        : app.cv_url;

      if (!path) return app;

      const ext = path.split('.').pop() ?? 'pdf';
      const latinName = greekToLatin(app.full_name);
      const downloadFileName = `CV_${latinName || 'Applicant'}.${ext}`;

      const [{ data: signedDownloadData }, { data: signedViewData }] = await Promise.all([
        adminClient.storage.from('job-applications').createSignedUrl(path, 3600, {
          download: downloadFileName,
        }),
        adminClient.storage.from('job-applications').createSignedUrl(path, 3600),
      ]);

      return {
        ...app,
        cv_url: signedDownloadData?.signedUrl ?? app.cv_url,
        cv_view_url: signedViewData?.signedUrl ?? app.cv_url,
      };
    })
  );

  return applications;
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<ActionResult> {
  await requireAdmin();
  const adminClient = createAdminClient();

  const { data: appData, error: fetchErr } = await adminClient
    .from('job_applications')
    .select('job_id')
    .eq('id', applicationId)
    .single();

  if (fetchErr || !appData) {
    return { success: false, error: 'Η αίτηση δεν βρέθηκε.' };
  }

  const { error } = await adminClient
    .from('job_applications')
    .update({ status })
    .eq('id', applicationId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/jobs/${appData.job_id}/applications`);
  revalidatePath('/admin/jobs');
  return { success: true };
}

// ──────────────────────────────────────────────────────────────
// PUBLIC: Submit job application (with optional CV file upload)
// ──────────────────────────────────────────────────────────────

export async function submitApplication(
  jobId: string,
  formData: FormData
): Promise<ActionResult> {
  const payload = {
    full_name: formData.get('full_name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    cover_letter: formData.get('cover_letter') as string | undefined,
  };

  const parsed = ApplicationSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  // Handle CV upload
  let cv_url: string | null = null;
  const cvFile = formData.get('cv') as File | null;

  if (cvFile && cvFile.size > 0) {
    if (cvFile.size > 5 * 1024 * 1024) {
      return { success: false, error: 'Το αρχείο CV δεν πρέπει να υπερβαίνει τα 5MB' };
    }
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(cvFile.type)) {
      return { success: false, error: 'Επιτρέπονται μόνο αρχεία PDF και Word (.doc, .docx)' };
    }

    const ext = cvFile.name.split('.').pop() ?? 'pdf';
    // Format filename with applicant name and timestamp (e.g. Evagelos-Bomponis-1786198045.pdf)
    const sanitizedName = parsed.data.full_name
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9\u0370-\u03ff_]/g, '');
    const fileName = `${jobId}/${sanitizedName || 'CV'}_${Date.now()}.${ext}`;

    // Use admin client to ensure upload succeeds safely
    const adminClient = createAdminClient();
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from('job-applications')
      .upload(fileName, cvFile, { contentType: cvFile.type, upsert: false });

    if (uploadError) {
      console.error('CV upload error:', uploadError.message);
      return { success: false, error: `Σφάλμα μεταφόρτωσης αρχείου: ${uploadError.message}` };
    } else {
      // Store relative path in DB to support signed URL creation or direct download
      cv_url = uploadData.path;
    }
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.from('job_applications').insert({
    job_id: jobId,
    full_name: parsed.data.full_name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    cover_letter: parsed.data.cover_letter || null,
    cv_url,
  });

  if (error) {
    console.error('DB insert error:', error.message);
    return { success: false, error: error.message || 'Σφάλμα κατά την υποβολή. Παρακαλώ προσπαθήστε ξανά.' };
  }

  return { success: true };
}
