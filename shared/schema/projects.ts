import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  logo: z.string().nullable().optional(),
  pitch: z.string(),
  industry: z.string(),
  fundingStage: z.string(),
  fundingAmount: z.number().nullable().optional(),
  equity: z.number().nullable().optional(),
  website: z.string().nullable().optional(),
  demo: z.string().nullable().optional(),
  deck: z.string().nullable().optional(),
  founderUserId: z.string().uuid(),
  problemStatement: z.string().nullable().optional(),
  solution: z.string().nullable().optional(),
  targetMarket: z.string().nullable().optional(),
  businessModel: z.string().nullable().optional(),
  competitorAnalysis: z.string().nullable().optional(),
  traction: z.string().nullable().optional(),
  team: z.string().nullable().optional(),
  aiMatchScore: z.number().nullable().optional(),
  aiInsights: z.string().nullable().optional(),
  pitchDeckFeedback: z.string().nullable().optional(),
  marketSegments: z.array(z.string()),
  technicalStack: z.array(z.string()),
  aiTags: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Project = z.infer<typeof ProjectSchema>;
