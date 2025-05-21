import { z } from "zod";

export const UserRoleEnum = z.enum([
  "founder",
  "investor",
  "ACCELERATOR",
  "GRANT_PROVIDER",
  "ADMIN",
]);

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  role: UserRoleEnum,
  companyName: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  profileImage: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  linkedin: z.string().nullable().optional(),
  twitter: z.string().nullable().optional(),
  openForContact: z.boolean(),
  investmentStage: z.array(z.string()),
  investmentSectors: z.array(z.string()),
  investmentMinSize: z.number().nullable().optional(),
  investmentMaxSize: z.number().nullable().optional(),
  investmentHistory: z.string().nullable().optional(),
  reputationScore: z.number().nullable().optional(),
  verificationStatus: z.boolean(),
  onboardingComplete: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
