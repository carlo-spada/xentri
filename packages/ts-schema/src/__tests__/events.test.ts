import { describe, it, expect } from 'vitest';
import type { SystemEvent, EventActor, EventMeta } from '../events.js';

describe('SystemEvent Types', () => {
  it('should accept valid SystemEvent structure', () => {
    const actor: EventActor = {
      type: 'user',
      id: 'user-123',
    };

    const meta: EventMeta = {
      source: 'core-api',
      environment: 'local',
    };

    const event: SystemEvent<{ brief_id: string }> = {
      id: 'evt-123',
      type: 'xentri.brief.updated.v1',
      occurred_at: new Date().toISOString(),
      org_id: 'org-456',
      actor,
      payload_schema: 'brief.updated@1.0',
      payload: { brief_id: 'brief-789' },
      meta,
      envelope_version: '1.0',
    };

    expect(event.id).toBe('evt-123');
    expect(event.type).toBe('xentri.brief.updated.v1');
    expect(event.org_id).toBe('org-456');
    expect(event.actor.type).toBe('user');
    expect(event.payload.brief_id).toBe('brief-789');
    expect(event.envelope_version).toBe('1.0');
  });

  it('should allow optional fields', () => {
    const event: SystemEvent = {
      id: 'evt-minimal',
      type: 'xentri.test.v1',
      occurred_at: new Date().toISOString(),
      org_id: 'org-123',
      actor: { type: 'system', id: 'test' },
      payload_schema: 'test@1.0',
      payload: {},
      envelope_version: '1.0',
    };

    expect(event.meta).toBeUndefined();
    expect(event.dedupe_key).toBeUndefined();
    expect(event.correlation_id).toBeUndefined();
    expect(event.trace_id).toBeUndefined();
  });

  it('should enforce actor types', () => {
    const userActor: EventActor = { type: 'user', id: 'u1' };
    const systemActor: EventActor = { type: 'system', id: 's1' };
    const jobActor: EventActor = { type: 'job', id: 'j1' };

    expect(userActor.type).toBe('user');
    expect(systemActor.type).toBe('system');
    expect(jobActor.type).toBe('job');
  });
});
