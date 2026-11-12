import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { getContent } from '@/lib/get-content';
import { FieldEditor } from '@/components/admin/FieldEditor';
import { ArrayEditor } from '@/components/admin/ArrayEditor';
import { SectionEditorLayout } from '@/components/admin/SectionEditorLayout';
import { siteContent } from '@/lib/content';
import { faqItems as defaultFaqItems, pricingTiers as defaultPricingTiers } from '@/lib/constants';

const sectionTitles: Record<string, string> = {
  hero: 'Ενότητα Hero',
  problem: 'Ενότητα Προβλήματος',
  services: 'Υπηρεσίες',
  testimonials: 'Αξιολογήσεις',
  pricing: 'Τιμολόγηση',
  faq: 'FAQ',
  'lead-form': 'Φόρμα Επικοινωνίας',
  footer: 'Footer',
};

export async function generateStaticParams() {
  return Object.keys(sectionTitles).map((section) => ({ section }));
}

export default async function SectionEditorPage(props: PageProps<'/admin/[section]'>) {
  const { section } = await props.params;
  await requireAdmin();

  if (!sectionTitles[section]) notFound();

  const { siteContent: content, faqItems, pricingTiers } = await getContent();

  return (
    <SectionEditorLayout>
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-1 block">
          Επεξεργασία
        </span>
        <h2 className="text-2xl font-bold text-navy font-heading">{sectionTitles[section]}</h2>
        <p className="text-muted text-sm mt-1">
          Οι αλλαγές αποθηκεύονται μεμονωμένα. Κάνε κλικ Αποθήκευση σε κάθε πεδίο μετά την επεξεργασία.
        </p>
      </div>

      {/* Section-specific editor */}
      <div className="space-y-4">
        {section === 'hero' && <HeroEditor content={content} />}
        {section === 'problem' && <ProblemEditor content={content} />}
        {section === 'services' && <ServicesEditor content={content} />}
        {section === 'testimonials' && <TestimonialsEditor content={content} />}
        {section === 'pricing' && <PricingEditor pricingTiers={pricingTiers} />}
        {section === 'faq' && <FAQEditor faqItems={faqItems} />}
        {section === 'lead-form' && <LeadFormEditor content={content} />}
        {section === 'footer' && <FooterEditor content={content} />}
      </div>
    </SectionEditorLayout>
  );
}

// ─────────────────────────────────────────────
// Section Editor Components
// ─────────────────────────────────────────────

function EditorCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-border rounded-xl p-4 sm:p-6 w-full min-w-0">
      <h3 className="text-xs font-bold text-teal-dark uppercase tracking-widest mb-4 sm:mb-5 pb-3 border-b border-border">
        {title}
      </h3>
      <div className="space-y-4 sm:space-y-5">{children}</div>
    </div>
  );
}

function HeroEditor({ content }: { content: typeof siteContent }) {
  const h = content.hero;
  const d = siteContent.hero;
  return (
    <>
      <EditorCard title="Main Text">
        <FieldEditor section="hero" fieldKey="headline" label="Headline (first line)" defaultValue={d.headline} currentValue={h.headline} hint="The main bold headline shown in the hero" />
        <FieldEditor section="hero" fieldKey="headlineAccent" label="Headline Accent (teal line)" defaultValue={d.headlineAccent} currentValue={h.headlineAccent} />
        <FieldEditor section="hero" fieldKey="subheadline" label="Subheadline" defaultValue={d.subheadline} currentValue={h.subheadline} type="textarea" />
      </EditorCard>
      <EditorCard title="CTA Buttons">
        <FieldEditor section="hero" fieldKey="ctaPrimary" label="Primary CTA" defaultValue={d.ctaPrimary} currentValue={h.ctaPrimary} placeholder="e.g. Ξεκινήστε Δωρεάν" />
        <FieldEditor section="hero" fieldKey="ctaSecondary" label="Secondary CTA" defaultValue={d.ctaSecondary} currentValue={h.ctaSecondary} />
      </EditorCard>
      <EditorCard title="Brand">
        <FieldEditor section="brand" fieldKey="name" label="Brand Name" defaultValue={siteContent.brand.name} currentValue={content.brand.name} />
        <FieldEditor section="brand" fieldKey="tagline" label="Brand Tagline" defaultValue={siteContent.brand.tagline} currentValue={content.brand.tagline} />
      </EditorCard>
    </>
  );
}

function ProblemEditor({ content }: { content: typeof siteContent }) {
  const p = content.problem;
  const d = siteContent.problem;
  return (
    <>
      <EditorCard title="Section Header">
        <FieldEditor section="problem" fieldKey="sectionLabel" label="Section Label" defaultValue={d.sectionLabel} currentValue={p.sectionLabel} />
        <FieldEditor section="problem" fieldKey="title" label="Title" defaultValue={d.title} currentValue={p.title} type="textarea" />
        <FieldEditor section="problem" fieldKey="subtitle" label="Subtitle" defaultValue={d.subtitle} currentValue={p.subtitle} type="textarea" />
      </EditorCard>
      <EditorCard title="Transition">
        <FieldEditor section="problem" fieldKey="transition" label="Transition Text" defaultValue={d.transition} currentValue={p.transition} />
        <FieldEditor section="problem" fieldKey="transitionCta" label="Transition CTA" defaultValue={d.transitionCta} currentValue={p.transitionCta} />
      </EditorCard>
      <EditorCard title="Problem Cards">
        <ArrayEditor
          section="problem"
          fieldKey="cards"
          label="Problem Cards (3)"
          items={p.cards.map(c => ({ title: c.title, description: c.description, icon: c.icon }))}
          fields={[
            { key: 'title', label: 'Card Title' },
            { key: 'description', label: 'Card Description', type: 'textarea' },
          ]}
          addLabel="Add Problem Card"
        />
      </EditorCard>
    </>
  );
}

function ServicesEditor({ content }: { content: typeof siteContent }) {
  const s = content.services;
  const d = siteContent.services;
  return (
    <>
      <EditorCard title="Section Header">
        <FieldEditor section="services" fieldKey="sectionLabel" label="Section Label" defaultValue={d.sectionLabel} currentValue={s.sectionLabel} />
        <FieldEditor section="services" fieldKey="title" label="Title" defaultValue={d.title} currentValue={s.title} type="textarea" />
        <FieldEditor section="services" fieldKey="subtitle" label="Subtitle" defaultValue={d.subtitle} currentValue={s.subtitle} type="textarea" />
      </EditorCard>
      {s.items.map((item, i) => {
        const def = siteContent.services.items[i];
        return (
          <EditorCard key={item.slug} title={`Service ${i + 1}: ${item.title}`}>
            <FieldEditor section={`services_item_${i}`} fieldKey="title" label="Title" defaultValue={def?.title ?? ''} currentValue={item.title} />
            <FieldEditor section={`services_item_${i}`} fieldKey="description" label="Description" defaultValue={def?.description ?? ''} currentValue={item.description} type="textarea" />
          </EditorCard>
        );
      })}
    </>
  );
}

function TestimonialsEditor({ content }: { content: typeof siteContent }) {
  const t = content.testimonials;
  const d = siteContent.testimonials;
  return (
    <>
      <EditorCard title="Section Header">
        <FieldEditor section="testimonials" fieldKey="sectionLabel" label="Section Label" defaultValue={d.sectionLabel} currentValue={t.sectionLabel} />
        <FieldEditor section="testimonials" fieldKey="title" label="Title" defaultValue={d.title} currentValue={t.title} type="textarea" />
        <FieldEditor section="testimonials" fieldKey="reviewScore" label="Review Score" defaultValue={d.reviewScore} currentValue={t.reviewScore} placeholder="e.g. 4.9/5" />
        <FieldEditor section="testimonials" fieldKey="reviewCount" label="Review Count" defaultValue={d.reviewCount} currentValue={t.reviewCount} placeholder="e.g. 127 ιδιοκτήτες" />
      </EditorCard>
      <EditorCard title="Testimonials">
        <ArrayEditor
          section="testimonials"
          fieldKey="items"
          label="Testimonial Cards"
          items={t.items.map(i => ({ quote: i.quote, name: i.name, city: i.city, properties: i.properties, rating: String(i.rating) }))}
          fields={[
            { key: 'name', label: 'Name' },
            { key: 'quote', label: 'Quote', type: 'textarea' },
            { key: 'city', label: 'City' },
            { key: 'properties', label: 'Properties (e.g. 2 ακίνητα)' },
            { key: 'rating', label: 'Rating (1-5)' },
          ]}
          addLabel="Add Testimonial"
        />
      </EditorCard>
    </>
  );
}

function PricingEditor({ pricingTiers }: { pricingTiers: typeof defaultPricingTiers }) {
  return (
    <EditorCard title="Pricing Plans">
      <p className="text-slate-500 text-xs mb-4">Επεξεργασία όλων των πακέτων — όνομα, τιμή, περιγραφή και χαρακτηριστικά.</p>
      <ArrayEditor
        section="pricingTiers"
        fieldKey="items"
        label="Pricing Plans"
        items={pricingTiers.map(t => ({
          name: t.name,
          description: t.description,
          priceMonthly: t.priceMonthly,
          priceYearly: t.priceYearly,
          priceSuffix: t.priceSuffix,
          properties: t.properties,
          cta: t.cta,
          badge: t.badge ?? '',
        }))}
        fields={[
          { key: 'name', label: 'Plan Name' },
          { key: 'description', label: 'Description' },
          { key: 'priceMonthly', label: 'Monthly Price (e.g. €79)' },
          { key: 'priceYearly', label: 'Yearly Price (e.g. €63)' },
          { key: 'priceSuffix', label: 'Price Suffix (e.g. /μήνα)' },
          { key: 'properties', label: 'Properties (e.g. 1 ακίνητο)' },
          { key: 'cta', label: 'CTA Button Text' },
          { key: 'badge', label: 'Badge (optional, e.g. Πιο Δημοφιλές)' },
        ]}
        addLabel="Add Pricing Plan"
      />
    </EditorCard>
  );
}

function FAQEditor({ faqItems }: { faqItems: typeof defaultFaqItems }) {
  return (
    <EditorCard title="FAQ Items">
      <p className="text-slate-500 text-xs mb-4">Προσθήκη, επεξεργασία ή διαγραφή ερωτήσεων και απαντήσεων.</p>
      <ArrayEditor
        section="faqItems"
        fieldKey="items"
        label="Questions & Answers"
        items={faqItems.map(f => ({ question: f.question, answer: f.answer }))}
        fields={[
          { key: 'question', label: 'Question' },
          { key: 'answer', label: 'Answer', type: 'textarea' },
        ]}
        addLabel="Add FAQ Question"
      />
    </EditorCard>
  );
}

function LeadFormEditor({ content }: { content: typeof siteContent }) {
  const f = content.leadForm;
  const d = siteContent.leadForm;
  return (
    <>
      <EditorCard title="Section Copy">
        <FieldEditor section="leadForm" fieldKey="title" label="Title" defaultValue={d.title} currentValue={f.title} />
        <FieldEditor section="leadForm" fieldKey="titleAccent" label="Title Accent (teal)" defaultValue={d.titleAccent} currentValue={f.titleAccent} />
        <FieldEditor section="leadForm" fieldKey="subtitle" label="Subtitle" defaultValue={d.subtitle} currentValue={f.subtitle} type="textarea" />
        <FieldEditor section="leadForm" fieldKey="submitCta" label="Submit Button Text" defaultValue={d.submitCta} currentValue={f.submitCta} />
        <FieldEditor section="leadForm" fieldKey="trustMicroCopy" label="Trust Note (below button)" defaultValue={d.trustMicroCopy} currentValue={f.trustMicroCopy} />
        <FieldEditor section="leadForm" fieldKey="successMessage" label="Success Message" defaultValue={d.successMessage} currentValue={f.successMessage} />
      </EditorCard>
    </>
  );
}

function FooterEditor({ content }: { content: typeof siteContent }) {
  const ft = content.footer;
  const d = siteContent.footer;
  return (
    <>
      <EditorCard title="Brand Description">
        <FieldEditor section="footer" fieldKey="description" label="Footer Description" defaultValue={d.description} currentValue={ft.description} type="textarea" />
      </EditorCard>
      <EditorCard title="Contact Info">
        <FieldEditor section="footer_contact" fieldKey="email" label="Email" defaultValue={d.contact.email} currentValue={ft.contact.email} type="email" />
        <FieldEditor section="footer_contact" fieldKey="phone" label="Phone (Mobile)" defaultValue={d.contact.phone} currentValue={ft.contact.phone} type="tel" />
        <FieldEditor section="footer_contact" fieldKey="landline" label="Landline" defaultValue={d.contact.landline} currentValue={ft.contact.landline} type="tel" />
      </EditorCard>
      <EditorCard title="Social Links">
        <FieldEditor section="footer_social" fieldKey="instagram" label="Instagram URL" defaultValue={d.social.instagram} currentValue={ft.social.instagram} type="url" />
        <FieldEditor section="footer_social" fieldKey="facebook" label="Facebook URL" defaultValue={d.social.facebook} currentValue={ft.social.facebook} type="url" />
        <FieldEditor section="footer_social" fieldKey="linkedin" label="LinkedIn URL" defaultValue={d.social.linkedin} currentValue={ft.social.linkedin} type="url" />
      </EditorCard>
    </>
  );
}
