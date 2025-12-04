export type CacheKeyBuilder = (params: Record<string, string>) => string

export type CacheEntry = {
  description: string
  key: CacheKeyBuilder
}

export type CacheContext = 'brief' | 'site' | 'leads'

export const CacheKeys: Record<CacheContext, CacheEntry> = {
  brief: {
    description: 'Org brief projection',
    key: ({ org_id }) => `brief:${org_id}`,
  },
  site: {
    description: 'Site projection and CDN tag',
    key: ({ org_id, site_id }) => `site:${org_id}:${site_id}`,
  },
  leads: {
    description: 'Lead list cursor and entity caches',
    key: ({ org_id, lead_id }) => (lead_id ? `lead:${org_id}:${lead_id}` : `leads:list:${org_id}`),
  },
}

export const InvalidationEvents: Record<string, CacheContext[]> = {
  'xentri.brief.updated.v1': ['brief'],
  'xentri.website.published.v1': ['site'],
  'xentri.page.updated.v1': ['site'],
  'xentri.lead.created.v1': ['leads'],
  'xentri.lead.updated.v1': ['leads'],
}
