import { z } from 'zod'

// ===================
// Brief Section Status
// ===================

export const BriefSectionStatusSchema = z.enum(['draft', 'ready'])
export type BriefSectionStatus = z.infer<typeof BriefSectionStatusSchema>

export const BriefCompletionStatusSchema = z.enum(['draft', 'complete'])
export type BriefCompletionStatus = z.infer<typeof BriefCompletionStatusSchema>

// ===================
// Brief Sections (7 sections per Story 1.6)
// ===================

/**
 * Identity Section - Business name, tagline, founding story, values
 */
export const IdentitySectionSchema = z.object({
  businessName: z.string().optional(),
  tagline: z.string().optional(),
  foundingStory: z.string().optional(),
  coreValues: z.array(z.string()).optional(),
})
export type IdentitySection = z.infer<typeof IdentitySectionSchema>

/**
 * Audience Section - Target audience, pain points, demographics
 */
export const AudienceSectionSchema = z.object({
  primaryAudience: z.string().optional(),
  painPoints: z.array(z.string()).optional(),
  demographics: z.string().optional(),
})
export type AudienceSection = z.infer<typeof AudienceSectionSchema>

/**
 * Offerings Section - Services and products
 */
export const ServiceSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.string().optional(),
})
export type Service = z.infer<typeof ServiceSchema>

export const ProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
})
export type Product = z.infer<typeof ProductSchema>

export const OfferingsSectionSchema = z.object({
  services: z.array(ServiceSchema).optional(),
  products: z.array(ProductSchema).optional(),
})
export type OfferingsSection = z.infer<typeof OfferingsSectionSchema>

/**
 * Positioning Section - Unique value proposition, differentiators
 */
export const PositioningSectionSchema = z.object({
  uniqueValueProposition: z.string().optional(),
  differentiators: z.array(z.string()).optional(),
  competitiveAdvantage: z.string().optional(),
})
export type PositioningSection = z.infer<typeof PositioningSectionSchema>

/**
 * Operations Section - Business model, delivery, key processes
 */
export const OperationsSectionSchema = z.object({
  businessModel: z.string().optional(),
  deliveryMethod: z.string().optional(),
  keyProcesses: z.array(z.string()).optional(),
})
export type OperationsSection = z.infer<typeof OperationsSectionSchema>

/**
 * Goals Section - Short-term and long-term objectives
 */
export const GoalsSectionSchema = z.object({
  shortTermGoals: z.array(z.string()).optional(),
  longTermGoals: z.array(z.string()).optional(),
  milestones: z.array(z.string()).optional(),
})
export type GoalsSection = z.infer<typeof GoalsSectionSchema>

/**
 * Proof Section - Testimonials, case studies, metrics
 */
export const ProofSectionSchema = z.object({
  testimonials: z.array(z.string()).optional(),
  caseStudies: z.array(z.string()).optional(),
  metrics: z.array(z.string()).optional(),
})
export type ProofSection = z.infer<typeof ProofSectionSchema>

// ===================
// Combined Brief Sections
// ===================

export const BriefSectionsSchema = z.object({
  identity: IdentitySectionSchema.optional().default({}),
  audience: AudienceSectionSchema.optional().default({}),
  offerings: OfferingsSectionSchema.optional().default({}),
  positioning: PositioningSectionSchema.optional().default({}),
  operations: OperationsSectionSchema.optional().default({}),
  goals: GoalsSectionSchema.optional().default({}),
  proof: ProofSectionSchema.optional().default({}),
})
export type BriefSections = z.infer<typeof BriefSectionsSchema>

export const BRIEF_SECTION_NAMES = [
  'identity',
  'audience',
  'offerings',
  'positioning',
  'operations',
  'goals',
  'proof',
] as const
export type BriefSectionName = (typeof BRIEF_SECTION_NAMES)[number]

// ===================
// Section Status Map
// ===================

export const BriefSectionStatusMapSchema = z.record(
  z.enum(BRIEF_SECTION_NAMES),
  BriefSectionStatusSchema
)
export type BriefSectionStatusMap = z.infer<typeof BriefSectionStatusMapSchema>

// ===================
// Full Brief Schema
// ===================

export const BriefSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string(),
  userId: z.string(),
  schemaVersion: z.string().default('1.0'),
  sections: BriefSectionsSchema,
  sectionStatus: BriefSectionStatusMapSchema.optional().default({}),
  completionStatus: BriefCompletionStatusSchema.default('draft'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
export type Brief = z.infer<typeof BriefSchema>

// ===================
// API Input/Output Schemas
// ===================

/**
 * Schema for creating a new Brief
 */
export const CreateBriefInputSchema = z.object({
  sections: BriefSectionsSchema.optional().default({}),
  schemaVersion: z.string().optional(),
})
export type CreateBriefInput = z.infer<typeof CreateBriefInputSchema>

/**
 * Schema for updating Brief sections
 */
export const UpdateBriefInputSchema = z.object({
  sections: BriefSectionsSchema.partial().optional(),
  sectionStatus: z.record(z.enum(BRIEF_SECTION_NAMES), BriefSectionStatusSchema).optional(),
  completionStatus: BriefCompletionStatusSchema.optional(),
})
export type UpdateBriefInput = z.infer<typeof UpdateBriefInputSchema>

/**
 * Brief API response
 */
export const BriefResponseSchema = z.object({
  data: BriefSchema.nullable(),
})
export type BriefResponse = z.infer<typeof BriefResponseSchema>

// ===================
// Utilities
// ===================

/**
 * Determines section completion status based on content
 */
export function determineSectionStatus(
  sectionName: BriefSectionName,
  sections: BriefSections
): BriefSectionStatus {
  const section = sections[sectionName]
  if (!section) return 'draft'

  // Section is 'ready' if it has any non-empty values
  const hasContent = Object.values(section).some((value) => {
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'string') return value.trim().length > 0
    return value !== undefined && value !== null
  })

  return hasContent ? 'ready' : 'draft'
}

/**
 * Calculate overall completion status based on section statuses
 */
export function calculateCompletionStatus(
  sectionStatus: BriefSectionStatusMap
): BriefCompletionStatus {
  const allSectionsReady = BRIEF_SECTION_NAMES.every((name) => sectionStatus[name] === 'ready')
  return allSectionsReady ? 'complete' : 'draft'
}

/**
 * Get populated section names from Brief
 */
export function getPopulatedSections(sections: BriefSections): BriefSectionName[] {
  return BRIEF_SECTION_NAMES.filter((name) => {
    const section = sections[name]
    if (!section) return false
    return Object.values(section).some((value) => {
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'string') return value.trim().length > 0
      return value !== undefined && value !== null
    })
  })
}
