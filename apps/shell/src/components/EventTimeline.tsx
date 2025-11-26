import { useEffect, useState } from 'react';
import type { SystemEvent, EventListResponse } from '@xentri/ts-schema';

interface EventTimelineProps {
  apiUrl?: string;
  orgId?: string;
  limit?: number;
}

/**
 * EventTimeline - Minimal timeline panel for Story 1.2 vertical slice
 *
 * Displays recent system events with type, timestamp, and source.
 * Uses the GET /api/v1/events endpoint with org context.
 */
export function EventTimeline({
  apiUrl = 'http://localhost:3000',
  orgId,
  limit = 10,
}: EventTimelineProps) {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      if (!orgId) {
        setError('No organization context');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/v1/events?limit=${limit}`, {
          headers: {
            'x-org-id': orgId,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: EventListResponse = await response.json();
        setEvents(data.data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch events';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [apiUrl, orgId, limit]);

  // Format timestamp for display
  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format event type for display (e.g., "xentri.user.signup.v1" → "User Signup")
  const formatEventType = (type: string): string => {
    const parts = type.split('.');
    if (parts.length >= 3) {
      const action = parts.slice(1, -1).join(' ');
      return action
        .split(/[._]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return type;
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Recent Events</h3>

      {loading && <p style={styles.status}>Loading events...</p>}

      {error && (
        <p style={styles.error}>
          {error}
        </p>
      )}

      {!loading && !error && events.length === 0 && (
        <p style={styles.status}>No events yet</p>
      )}

      {!loading && !error && events.length > 0 && (
        <ul style={styles.list}>
          {events.map((event) => (
            <li key={event.id} style={styles.item}>
              <div style={styles.itemHeader}>
                <span style={styles.eventType}>{formatEventType(event.type)}</span>
                <span style={styles.source}>{event.source}</span>
              </div>
              <div style={styles.timestamp}>{formatTime(event.occurred_at)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Inline styles using Xentri design tokens
const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    maxWidth: '400px',
    margin: '2rem auto',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(148, 163, 184, 0.1)',
  },
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#f8fafc',
    marginBottom: '1rem',
    borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
    paddingBottom: '0.5rem',
  },
  status: {
    color: '#94a3b8',
    fontSize: '0.875rem',
    textAlign: 'center',
  },
  error: {
    color: '#f87171',
    fontSize: '0.875rem',
    textAlign: 'center',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  item: {
    padding: '0.75rem',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: '0.5rem',
    borderLeft: '3px solid #38bdf8',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.25rem',
  },
  eventType: {
    color: '#f8fafc',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  source: {
    color: '#64748b',
    fontSize: '0.75rem',
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    padding: '0.125rem 0.5rem',
    borderRadius: '0.25rem',
  },
  timestamp: {
    color: '#94a3b8',
    fontSize: '0.75rem',
  },
};
