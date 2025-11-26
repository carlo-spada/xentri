export type EventActorType = 'user' | 'system' | 'job';

export type EventActor = {
  type: EventActorType;
  id: string;
};

export type EventMeta = {
  source: string;
  environment?: 'local' | 'staging' | 'prod';
  [key: string]: unknown;
};

export type SystemEvent<TPayload = Record<string, unknown>> = {
  id: string;
  type: string; // e.g., xentri.brief.updated.v1
  occurred_at: string; // ISO8601
  org_id: string;
  actor: EventActor;
  payload_schema: string; // e.g., brief.updated@1.0
  payload: TPayload;
  meta?: EventMeta;
  dedupe_key?: string;
  correlation_id?: string;
  trace_id?: string;
  envelope_version: '1.0';
};
