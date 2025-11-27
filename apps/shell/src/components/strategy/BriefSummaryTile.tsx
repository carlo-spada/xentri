import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { Button } from '@xentri/ui';
import { FileText, Edit, CheckCircle, Circle, Loader2 } from 'lucide-react';
import type { BriefSectionName } from '@xentri/ts-schema';
import {
  $brief,
  $briefLoading,
  $briefError,
  $briefCompletionPercent,
  setBrief,
  setBriefLoading,
  setBriefError,
  getApiUrl,
} from '../../stores/brief.js';

interface BriefSummaryTileProps {
  orgId?: string;
  onEditClick?: (briefId: string) => void;
  onViewClick?: (briefId: string) => void;
}

const SECTION_LABELS: Record<BriefSectionName, string> = {
  identity: 'Identity',
  audience: 'Audience',
  offerings: 'Offerings',
  positioning: 'Positioning',
  operations: 'Operations',
  goals: 'Goals',
  proof: 'Proof',
};

const SECTION_ORDER: BriefSectionName[] = [
  'identity',
  'audience',
  'offerings',
  'positioning',
  'operations',
  'goals',
  'proof',
];

/**
 * BriefSummaryTile - Shows Brief status/summary in Strategy category
 *
 * Story 1.6, Task 3.2: React island showing Brief status
 * Per UX Design Spec 4.1: First-time user journey
 */
export function BriefSummaryTile({
  orgId,
  onEditClick,
  onViewClick,
}: BriefSummaryTileProps) {
  const brief = useStore($brief);
  const loading = useStore($briefLoading);
  const error = useStore($briefError);
  const completionPercent = useStore($briefCompletionPercent);

  useEffect(() => {
    async function fetchBrief() {
      if (!orgId) {
        setBriefError('No organization context');
        return;
      }

      setBriefLoading(true);

      try {
        const response = await fetch(`${getApiUrl()}/api/v1/briefs/current`, {
          headers: {
            'x-org-id': orgId,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setBrief(data.data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch brief';
        setBriefError(message);
      } finally {
        setBriefLoading(false);
      }
    }

    fetchBrief();
  }, [orgId]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <span>Loading your Brief...</span>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorState}>
          <p style={styles.errorText}>{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!brief) {
    return null; // CreateBriefCTA will be shown instead
  }

  const businessName = brief.sections?.identity?.businessName || 'Your Business';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.iconWrapper}>
          <FileText size={24} />
        </div>
        <div style={styles.headerText}>
          <h3 style={styles.title}>Universal Brief</h3>
          <p style={styles.businessName}>{businessName}</p>
        </div>
        <div style={styles.statusBadge}>
          {brief.completionStatus === 'complete' ? (
            <span style={styles.completeBadge}>Complete</span>
          ) : (
            <span style={styles.draftBadge}>Draft</span>
          )}
        </div>
      </div>

      <div style={styles.progressSection}>
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>Section Progress</span>
          <span style={styles.progressPercent}>{completionPercent}%</span>
        </div>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${completionPercent}%`,
            }}
          />
        </div>
      </div>

      <div style={styles.sectionsGrid}>
        {SECTION_ORDER.map((section) => {
          const isReady = brief.sectionStatus?.[section] === 'ready';
          return (
            <div
              key={section}
              style={{
                ...styles.sectionItem,
                opacity: isReady ? 1 : 0.6,
              }}
            >
              {isReady ? (
                <CheckCircle size={16} color="var(--color-success)" />
              ) : (
                <Circle size={16} color="var(--color-text-muted)" />
              )}
              <span style={styles.sectionLabel}>{SECTION_LABELS[section]}</span>
            </div>
          );
        })}
      </div>

      <div style={styles.actions}>
        <Button
          variant="default"
          onClick={() => onViewClick?.(brief.id)}
        >
          View Brief
        </Button>
        <Button
          variant="outline"
          onClick={() => onEditClick?.(brief.id)}
        >
          <Edit size={16} />
          Edit
        </Button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: '1rem',
    border: '1px solid var(--color-surface-plus)',
    padding: '1.5rem',
    maxWidth: '600px',
  },
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    color: 'var(--color-text-secondary)',
    padding: '2rem',
  },
  errorState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '2rem',
  },
  errorText: {
    color: 'var(--color-error)',
    fontSize: '0.875rem',
    margin: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '0.75rem',
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-base)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    margin: 0,
  },
  businessName: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    margin: 0,
    marginTop: '0.25rem',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
  },
  completeBadge: {
    fontSize: '0.75rem',
    fontWeight: 500,
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    backgroundColor: 'var(--color-success)',
    color: 'var(--color-base)',
  },
  draftBadge: {
    fontSize: '0.75rem',
    fontWeight: 500,
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    backgroundColor: 'var(--color-warning)',
    color: 'var(--color-base)',
  },
  progressSection: {
    marginBottom: '1.5rem',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  progressLabel: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
  },
  progressPercent: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  },
  progressBar: {
    height: '8px',
    backgroundColor: 'var(--color-surface-plus)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--color-primary)',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  sectionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  sectionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: 'var(--color-text-primary)',
  },
  sectionLabel: {
    fontSize: '0.8125rem',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--color-surface-plus)',
  },
};
