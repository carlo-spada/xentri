import { useState, useCallback } from 'react';
import { Button } from '@xentri/ui';
import { ChevronLeft, ChevronRight, Save, Loader2, CheckCircle } from 'lucide-react';
import type { BriefSections, BriefSectionName } from '@xentri/ts-schema';
import { getApiUrl, setBrief } from '../../stores/brief.js';

interface BriefFormProps {
  orgId?: string;
  onSuccess?: (briefId: string) => void;
  onError?: (error: string) => void;
}

const SECTIONS: { key: BriefSectionName; title: string; description: string }[] = [
  {
    key: 'identity',
    title: 'Identity',
    description: 'Who are you? Define your business name, tagline, and core values.',
  },
  {
    key: 'audience',
    title: 'Audience',
    description: 'Who do you serve? Define your target audience and their pain points.',
  },
  {
    key: 'offerings',
    title: 'Offerings',
    description: 'What do you offer? List your products and services.',
  },
  {
    key: 'positioning',
    title: 'Positioning',
    description: 'What makes you unique? Define your value proposition.',
  },
  {
    key: 'operations',
    title: 'Operations',
    description: 'How do you deliver? Describe your business model.',
  },
  {
    key: 'goals',
    title: 'Goals',
    description: 'Where are you going? Set your short and long-term objectives.',
  },
  {
    key: 'proof',
    title: 'Proof',
    description: 'Why should they trust you? Share testimonials and metrics.',
  },
];

const INITIAL_SECTIONS: BriefSections = {
  identity: { businessName: '', tagline: '', foundingStory: '', coreValues: [] },
  audience: { primaryAudience: '', painPoints: [], demographics: '' },
  offerings: { services: [], products: [] },
  positioning: { uniqueValueProposition: '', differentiators: [], competitiveAdvantage: '' },
  operations: { businessModel: '', deliveryMethod: '', keyProcesses: [] },
  goals: { shortTermGoals: [], longTermGoals: [], milestones: [] },
  proof: { testimonials: [], caseStudies: [], metrics: [] },
};

/**
 * BriefForm - 7-section wizard for creating Universal Brief
 *
 * Story 1.6, Task 4: Brief creation form (guided form fallback)
 * Per UX Design Spec 1.3: Progressive disclosure for Brief sections
 */
export function BriefForm({ orgId, onSuccess, onError }: BriefFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [sections, setSections] = useState<BriefSections>(INITIAL_SECTIONS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentSection = SECTIONS[currentStep];
  const isLastStep = currentStep === SECTIONS.length - 1;
  const isFirstStep = currentStep === 0;

  const updateSection = useCallback(
    <K extends BriefSectionName>(
      sectionKey: K,
      field: string,
      value: string | string[]
    ) => {
      setSections((prev) => ({
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          [field]: value,
        },
      }));
      setSaved(false);
    },
    []
  );

  const handleSaveDraft = async () => {
    if (!orgId) {
      const msg = 'No organization context';
      setError(msg);
      onError?.(msg);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`${getApiUrl()}/api/v1/briefs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-org-id': orgId,
        },
        credentials: 'include',
        body: JSON.stringify({ sections }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to save brief');
      }

      const result = await response.json();
      setBrief(result.data);
      setSaved(true);

      // Redirect to Brief view after short delay
      setTimeout(() => {
        onSuccess?.(result.data.id);
        window.location.href = `/strategy/brief/${result.data.id}`;
      }, 500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save. Please retry.';
      setError(message);
      onError?.(message);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSaveDraft();
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderSectionFields = () => {
    const key = currentSection.key;

    switch (key) {
      case 'identity':
        return (
          <>
            <FormField
              label="Business Name"
              value={(sections.identity?.businessName as string) || ''}
              onChange={(v) => updateSection('identity', 'businessName', v)}
              placeholder="e.g., Acme Solutions"
            />
            <FormField
              label="Tagline"
              value={(sections.identity?.tagline as string) || ''}
              onChange={(v) => updateSection('identity', 'tagline', v)}
              placeholder="e.g., Simplifying business, one solution at a time"
            />
            <FormField
              label="Founding Story"
              value={(sections.identity?.foundingStory as string) || ''}
              onChange={(v) => updateSection('identity', 'foundingStory', v)}
              multiline
              placeholder="Tell the story of how your business came to be..."
            />
            <FormField
              label="Core Values (comma-separated)"
              value={(sections.identity?.coreValues as string[])?.join(', ') || ''}
              onChange={(v) => updateSection('identity', 'coreValues', v.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="e.g., Innovation, Integrity, Customer Focus"
            />
          </>
        );

      case 'audience':
        return (
          <>
            <FormField
              label="Primary Audience"
              value={(sections.audience?.primaryAudience as string) || ''}
              onChange={(v) => updateSection('audience', 'primaryAudience', v)}
              placeholder="e.g., Small business owners in the technology sector"
            />
            <FormField
              label="Pain Points (comma-separated)"
              value={(sections.audience?.painPoints as string[])?.join(', ') || ''}
              onChange={(v) => updateSection('audience', 'painPoints', v.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="e.g., Time management, Scaling challenges, Tech complexity"
            />
            <FormField
              label="Demographics"
              value={(sections.audience?.demographics as string) || ''}
              onChange={(v) => updateSection('audience', 'demographics', v)}
              multiline
              placeholder="Describe your target audience demographics..."
            />
          </>
        );

      case 'offerings':
        return (
          <>
            <p style={styles.hint}>
              Enter your services and products. You can add more details later.
            </p>
            <FormField
              label="Services (one per line)"
              value={
                (sections.offerings?.services as { name: string }[])
                  ?.map((s) => s.name)
                  .join('\n') || ''
              }
              onChange={(v) =>
                updateSection(
                  'offerings',
                  'services',
                  v.split('\n').filter(Boolean).map((name) => ({ name })) as unknown as string[]
                )
              }
              multiline
              placeholder="Consulting&#10;Implementation&#10;Support"
            />
          </>
        );

      case 'positioning':
        return (
          <>
            <FormField
              label="Unique Value Proposition"
              value={(sections.positioning as { uniqueValueProposition?: string })?.uniqueValueProposition || ''}
              onChange={(v) => updateSection('positioning', 'uniqueValueProposition', v)}
              multiline
              placeholder="What makes your business uniquely valuable to customers?"
            />
            <FormField
              label="Differentiators (comma-separated)"
              value={((sections.positioning as { differentiators?: string[] })?.differentiators || []).join(', ')}
              onChange={(v) => updateSection('positioning', 'differentiators', v.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="e.g., 24/7 support, Industry expertise, Custom solutions"
            />
          </>
        );

      case 'operations':
        return (
          <>
            <FormField
              label="Business Model"
              value={(sections.operations as { businessModel?: string })?.businessModel || ''}
              onChange={(v) => updateSection('operations', 'businessModel', v)}
              placeholder="e.g., B2B SaaS, Consulting, Product sales"
            />
            <FormField
              label="Delivery Method"
              value={(sections.operations as { deliveryMethod?: string })?.deliveryMethod || ''}
              onChange={(v) => updateSection('operations', 'deliveryMethod', v)}
              placeholder="e.g., Online platform, In-person, Hybrid"
            />
          </>
        );

      case 'goals':
        return (
          <>
            <FormField
              label="Short-term Goals (comma-separated)"
              value={((sections.goals as { shortTermGoals?: string[] })?.shortTermGoals || []).join(', ')}
              onChange={(v) => updateSection('goals', 'shortTermGoals', v.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="e.g., Launch new product, Reach 100 customers"
            />
            <FormField
              label="Long-term Goals (comma-separated)"
              value={((sections.goals as { longTermGoals?: string[] })?.longTermGoals || []).join(', ')}
              onChange={(v) => updateSection('goals', 'longTermGoals', v.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="e.g., Market expansion, IPO, Industry leadership"
            />
          </>
        );

      case 'proof':
        return (
          <>
            <FormField
              label="Key Metrics (comma-separated)"
              value={((sections.proof as { metrics?: string[] })?.metrics || []).join(', ')}
              onChange={(v) => updateSection('proof', 'metrics', v.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="e.g., 500+ clients, 99% satisfaction, $10M revenue"
            />
            <FormField
              label="Testimonials (one per line)"
              value={((sections.proof as { testimonials?: string[] })?.testimonials || []).join('\n')}
              onChange={(v) => updateSection('proof', 'testimonials', v.split('\n').filter(Boolean))}
              multiline
              placeholder="Add customer quotes or testimonials..."
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {/* Error banner (AC6: Surface event write failures visibly) */}
      {error && (
        <div style={styles.errorBanner}>
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={styles.errorDismiss}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Progress indicator */}
      <div style={styles.progress}>
        {SECTIONS.map((section, index) => (
          <div
            key={section.key}
            style={{
              ...styles.progressDot,
              backgroundColor:
                index === currentStep
                  ? 'var(--color-primary)'
                  : index < currentStep
                    ? 'var(--color-success)'
                    : 'var(--color-surface-plus)',
            }}
            onClick={() => setCurrentStep(index)}
            title={section.title}
          />
        ))}
      </div>

      {/* Section header */}
      <div style={styles.header}>
        <span style={styles.stepIndicator}>
          Step {currentStep + 1} of {SECTIONS.length}
        </span>
        <h2 style={styles.title}>{currentSection.title}</h2>
        <p style={styles.description}>{currentSection.description}</p>
      </div>

      {/* Form fields */}
      <div style={styles.fields}>{renderSectionFields()}</div>

      {/* Navigation */}
      <div style={styles.actions}>
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={isFirstStep || saving}
        >
          <ChevronLeft size={18} />
          Back
        </Button>

        <Button
          variant="outline"
          onClick={handleSaveDraft}
          disabled={saving}
        >
          {saving ? (
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
          ) : saved ? (
            <CheckCircle size={18} />
          ) : (
            <Save size={18} />
          )}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Draft'}
        </Button>

        <Button onClick={handleNext} disabled={saving}>
          {isLastStep ? 'Complete' : 'Next'}
          {!isLastStep && <ChevronRight size={18} />}
        </Button>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: FormFieldProps) {
  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <InputComponent
        style={{
          ...styles.input,
          ...(multiline ? styles.textarea : {}),
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={multiline ? 4 : undefined}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: '1rem',
    border: '1px solid var(--color-surface-plus)',
    padding: '2rem',
    maxWidth: '700px',
    margin: '0 auto',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '0.75rem 1rem',
    marginBottom: '1.5rem',
    backgroundColor: 'var(--color-error)',
    color: 'var(--color-base)',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
  },
  errorDismiss: {
    background: 'none',
    border: 'none',
    color: 'inherit',
    fontSize: '1.25rem',
    cursor: 'pointer',
    padding: '0.25rem',
    lineHeight: 1,
  },
  progress: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
  },
  progressDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  stepIndicator: {
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    margin: '0.5rem 0',
  },
  description: {
    fontSize: '1rem',
    color: 'var(--color-text-secondary)',
    margin: 0,
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--color-text-primary)',
  },
  input: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid var(--color-surface-plus)',
    backgroundColor: 'var(--color-base)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  textarea: {
    resize: 'vertical' as const,
    minHeight: '100px',
  },
  hint: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    marginBottom: '0.5rem',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid var(--color-surface-plus)',
  },
};
