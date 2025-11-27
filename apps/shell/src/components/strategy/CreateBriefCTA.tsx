import { Button } from '@xentri/ui';
import { FileText, ArrowRight } from 'lucide-react';

interface CreateBriefCTAProps {
  onCreateClick?: () => void;
}

/**
 * CreateBriefCTA - Empty state CTA when no Brief exists
 *
 * Story 1.6, Task 3.3: Empty state component for Strategy category
 * Per UX Design Spec 8.2: Show "Create your Universal Brief" CTA
 */
export function CreateBriefCTA({ onCreateClick }: CreateBriefCTAProps) {
  return (
    <div style={styles.container}>
      <div style={styles.iconWrapper}>
        <FileText size={48} strokeWidth={1.5} />
      </div>

      <h2 style={styles.title}>Create Your Universal Brief</h2>

      <p style={styles.description}>
        Your Universal Brief is the DNA of your business. It captures who you are, what you offer, and why you matter.
        Start here to unlock personalized tools and AI-powered insights.
      </p>

      <div style={styles.features}>
        <div style={styles.featureItem}>
          <span style={styles.featureNumber}>7</span>
          <span style={styles.featureLabel}>Sections to Define Your Business</span>
        </div>
        <div style={styles.featureItem}>
          <span style={styles.featureNumber}>~15</span>
          <span style={styles.featureLabel}>Minutes to Complete</span>
        </div>
      </div>

      <Button
        onClick={onCreateClick}
        size="lg"
        style={{ marginTop: '1.5rem' }}
      >
        Start Your Brief
        <ArrowRight size={18} />
      </Button>

      <p style={styles.hint}>
        You can save and continue anytime. Your progress is automatically saved.
      </p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '3rem 2rem',
    backgroundColor: 'var(--color-surface)',
    borderRadius: '1rem',
    border: '1px solid var(--color-surface-plus)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  iconWrapper: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-base)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    marginBottom: '0.75rem',
    margin: 0,
  },
  description: {
    fontSize: '1rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
    maxWidth: '480px',
    marginTop: '0.75rem',
    marginBottom: '1.5rem',
  },
  features: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '0.5rem',
  },
  featureItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
  },
  featureNumber: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--color-primary)',
  },
  featureLabel: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
  },
  hint: {
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    marginTop: '1rem',
  },
};
