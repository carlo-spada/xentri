export type UserRole = 'owner' | 'admin' | 'member' | 'viewer' | string;

export type UserClaims = {
  sub: string;
  email?: string;
  org_id: string;
  role: UserRole;
  iss: string;
  aud?: string;
  exp: number;
  iat?: number;
};

export type ServiceTokenClaims = {
  sub: string;
  iss: string;
  aud: string | string[];
  org_id: string;
  scope: string[];
  trace_id?: string;
  exp: number;
  iat?: number;
};
