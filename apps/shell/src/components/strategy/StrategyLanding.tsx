import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { Loader2 } from 'lucide-react';
import { BriefSummaryTile } from './BriefSummaryTile';
import { CreateBriefCTA } from './CreateBriefCTA';
import {
  $brief,
  $briefLoading,
  setBrief,
  setBriefLoading,
  setBriefError,
  getApiUrl,
} from '../../stores/brief.js';

interface StrategyLandingProps {
  orgId?: string;
}

/**
 * StrategyLanding - Main Strategy category landing component
 *
 * Story 1.6, Task 3: Strategy category landing page
 * - Shows CreateBriefCTA if no Brief exists
 * - Shows BriefSummaryTile if Brief exists
 */
export function StrategyLanding({ orgId }: StrategyLandingProps) {
  const brief = useStore($brief);
  const loading = useStore($briefLoading);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function fetchBrief() {
      if (!orgId) {
        setBriefError('No organization context');
        setInitialized(true);
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
        setInitialized(true);
      }
    }

    fetchBrief();
  }, [orgId]);

  const handleCreateClick = () => {
    window.location.href = '/strategy/brief/new';
  };

  const handleEditClick = (briefId: string) => {
    window.location.href = `/strategy/brief/${briefId}?edit=true`;
  };

  const handleViewClick = (briefId: string) => {
    window.location.href = `/strategy/brief/${briefId}`;
  };

  if (!initialized || loading) {
    return (
      <div style={styles.loading}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <span>Loading Strategy...</span>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Strategy</h1>
        <p style={styles.subtitle}>
          Define your business DNA and unlock AI-powered insights
        </p>
      </header>

      <section style={styles.content}>
        {brief ? (
          <BriefSummaryTile
            orgId={orgId}
            onEditClick={handleEditClick}
            onViewClick={handleViewClick}
          />
        ) : (
          <CreateBriefCTA onCreateClick={handleCreateClick} />
        )}
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '0 1rem',
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
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    margin: 0,
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1rem',
    color: 'var(--color-text-secondary)',
    margin: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
};
