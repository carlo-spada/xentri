import { useEffect, useState } from 'react';
import { Button } from '@xentri/ui';
import { Edit, CheckCircle, Circle, Loader2, ArrowLeft } from 'lucide-react';
import type { Brief, BriefSectionName, BriefSections } from '@xentri/ts-schema';
import { getApiUrl, setBrief } from '../../stores/brief.js';

interface BriefViewProps {
  briefId: string;
  orgId?: string;
}

const SECTION_CONFIG: {
  key: BriefSectionName;
  title: string;
  icon: string;
  fields: { key: string; label: string; isArray?: boolean }[];
}[] = [
  {
    key: 'identity',
    title: 'Identity',
    icon: '🎯',
    fields: [
      { key: 'businessName', label: 'Business Name' },
      { key: 'tagline', label: 'Tagline' },
      { key: 'foundingStory', label: 'Founding Story' },
      { key: 'coreValues', label: 'Core Values', isArray: true },
    ],
  },
  {
    key: 'audience',
    title: 'Audience',
    icon: '👥',
    fields: [
      { key: 'primaryAudience', label: 'Primary Audience' },
      { key: 'painPoints', label: 'Pain Points', isArray: true },
      { key: 'demographics', label: 'Demographics' },
    ],
  },
  {
    key: 'offerings',
    title: 'Offerings',
    icon: '📦',
    fields: [
      { key: 'services', label: 'Services', isArray: true },
      { key: 'products', label: 'Products', isArray: true },
    ],
  },
  {
    key: 'positioning',
    title: 'Positioning',
    icon: '⭐',
    fields: [
      { key: 'uniqueValueProposition', label: 'Unique Value Proposition' },
      { key: 'differentiators', label: 'Differentiators', isArray: true },
      { key: 'competitiveAdvantage', label: 'Competitive Advantage' },
    ],
  },
  {
    key: 'operations',
    title: 'Operations',
    icon: '⚙️',
    fields: [
      { key: 'businessModel', label: 'Business Model' },
      { key: 'deliveryMethod', label: 'Delivery Method' },
      { key: 'keyProcesses', label: 'Key Processes', isArray: true },
    ],
  },
  {
    key: 'goals',
    title: 'Goals',
    icon: '🎯',
    fields: [
      { key: 'shortTermGoals', label: 'Short-term Goals', isArray: true },
      { key: 'longTermGoals', label: 'Long-term Goals', isArray: true },
      { key: 'milestones', label: 'Milestones', isArray: true },
    ],
  },
  {
    key: 'proof',
    title: 'Proof',
    icon: '🏆',
    fields: [
      { key: 'testimonials', label: 'Testimonials', isArray: true },
      { key: 'caseStudies', label: 'Case Studies', isArray: true },
      { key: 'metrics', label: 'Key Metrics', isArray: true },
    ],
  },
];

/**
 * BriefView - Displays all 7 sections of the Universal Brief
 *
 * Story 1.6, Task 5: Brief view page
 */
export function BriefView({ briefId, orgId }: BriefViewProps) {
  const [brief, setBriefState] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBrief() {
      if (!orgId) {
        setError('No organization context');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${getApiUrl()}/api/v1/briefs/${briefId}`, {
          headers: {
            'x-org-id': orgId,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Brief not found');
          }
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setBriefState(data.data);
        setBrief(data.data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load brief';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchBrief();
  }, [briefId, orgId]);

  if (loading) {
    return (
      <div style={styles.loading}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <span>Loading Brief...</span>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        <p>{error}</p>
        <Button variant="outline" onClick={() => window.location.href = '/strategy'}>
          <ArrowLeft size={16} />
          Back to Strategy
        </Button>
      </div>
    );
  }

  if (!brief) {
    return null;
  }

  const businessName = brief.sections?.identity?.businessName || 'Your Business';

  const renderFieldValue = (
    section: BriefSections[BriefSectionName],
    fieldKey: string,
    isArray?: boolean
  ) => {
    const value = (section as Record<string, unknown>)?.[fieldKey];

    if (!value) {
      return <span style={styles.emptyValue}>Not set</span>;
    }

    if (isArray && Array.isArray(value)) {
      if (value.length === 0) {
        return <span style={styles.emptyValue}>None added</span>;
      }
      // Handle services/products which are objects
      if (typeof value[0] === 'object' && value[0] !== null) {
        return (
          <ul style={styles.list}>
            {value.map((item, i) => (
              <li key={i} style={styles.listItem}>
                {(item as { name: string }).name || JSON.stringify(item)}
              </li>
            ))}
          </ul>
        );
      }
      return (
        <ul style={styles.list}>
          {value.map((item, i) => (
            <li key={i} style={styles.listItem}>
              {String(item)}
            </li>
          ))}
        </ul>
      );
    }

    return <span style={styles.fieldValue}>{String(value)}</span>;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <Button
          variant="ghost"
          onClick={() => (window.location.href = '/strategy')}
          style={{ marginBottom: '1rem' }}
        >
          <ArrowLeft size={16} />
          Back to Strategy
        </Button>

        <div style={styles.titleRow}>
          <div>
            <h1 style={styles.title}>{businessName}</h1>
            <p style={styles.subtitle}>Universal Brief</p>
          </div>
          <div style={styles.statusBadge}>
            {brief.completionStatus === 'complete' ? (
              <span style={styles.completeBadge}>
                <CheckCircle size={14} />
                Complete
              </span>
            ) : (
              <span style={styles.draftBadge}>
                <Circle size={14} />
                Draft
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Sections */}
      <div style={styles.sections}>
        {SECTION_CONFIG.map((sectionConfig) => {
          const sectionData = brief.sections?.[sectionConfig.key];
          const status = brief.sectionStatus?.[sectionConfig.key];
          const isReady = status === 'ready';

          return (
            <section key={sectionConfig.key} style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>
                  <span style={styles.sectionIcon}>{sectionConfig.icon}</span>
                  <h2 style={styles.sectionName}>{sectionConfig.title}</h2>
                  {isReady ? (
                    <CheckCircle size={16} color="var(--color-success)" />
                  ) : (
                    <Circle size={16} color="var(--color-text-muted)" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    (window.location.href = `/strategy/brief/${briefId}?edit=${sectionConfig.key}`)
                  }
                >
                  <Edit size={14} />
                  Edit
                </Button>
              </div>

              <div style={styles.sectionContent}>
                {sectionConfig.fields.map((field) => (
                  <div key={field.key} style={styles.field}>
                    <span style={styles.fieldLabel}>{field.label}</span>
                    {renderFieldValue(sectionData, field.key, field.isArray)}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '4rem',
    color: 'var(--color-text-secondary)',
  },
  error: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '4rem',
    color: 'var(--color-error)',
  },
  header: {
    marginBottom: '2rem',
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    margin: 0,
  },
  subtitle: {
    fontSize: '1rem',
    color: 'var(--color-text-secondary)',
    margin: 0,
    marginTop: '0.25rem',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
  },
  completeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    padding: '0.5rem 1rem',
    borderRadius: '2rem',
    backgroundColor: 'var(--color-success)',
    color: 'var(--color-base)',
  },
  draftBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    padding: '0.5rem 1rem',
    borderRadius: '2rem',
    backgroundColor: 'var(--color-warning)',
    color: 'var(--color-base)',
  },
  sections: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  section: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: '1rem',
    border: '1px solid var(--color-surface-plus)',
    padding: '1.5rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--color-surface-plus)',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  sectionIcon: {
    fontSize: '1.25rem',
  },
  sectionName: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    margin: 0,
  },
  sectionContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  fieldLabel: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  fieldValue: {
    fontSize: '1rem',
    color: 'var(--color-text-primary)',
    lineHeight: 1.5,
  },
  emptyValue: {
    fontSize: '0.875rem',
    color: 'var(--color-text-muted)',
    fontStyle: 'italic',
  },
  list: {
    margin: 0,
    paddingLeft: '1.25rem',
    listStyle: 'disc',
  },
  listItem: {
    fontSize: '1rem',
    color: 'var(--color-text-primary)',
    marginBottom: '0.25rem',
  },
};
