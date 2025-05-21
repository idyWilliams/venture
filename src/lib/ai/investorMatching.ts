"use server";

import OpenAI from "openai";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

interface InvestorMatchResult {
  matchScore: number;
  reasons: string[];
  potentialInterest: string;
  keyInsights: string;
}

interface ProjectInvestorMatch {
  investor: {
    id: string;
    name: string;
    companyName?: string | null;
    investmentSectors: string[];
    matchScore: number;
    matchReasons: string[];
  };
}

/**
 * Calculate match scores between a project and potential investors
 * @param projectId The ID of the project to match
 * @param limit Maximum number of matches to return (default 10)
 */
export async function findMatchingInvestors(
  projectId: string,
  limit: number = 10
): Promise<ProjectInvestorMatch[]> {
  try {
    // Get the project details
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        title: true,
        description: true,
        industry: true,
        fundingStage: true,
        fundingAmount: true,
        equity: true,
        problemStatement: true,
        solution: true,
        targetMarket: true,
        businessModel: true,
        competitorAnalysis: true,
        marketSegments: true,
        technicalStack: true,
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // Get all investors
    const investors = await prisma.user.findMany({
      where: {
        role: UserRole.investor,
        onboardingComplete: true,
      },
      select: {
        id: true,
        name: true,
        companyName: true,
        investmentSectors: true,
        investmentStage: true,
        investmentMinSize: true,
        investmentMaxSize: true,
      },
    });

    // Calculate match scores for each investor
    const matches: ProjectInvestorMatch[] = [];

    for (const investor of investors) {
      // Basic filtering - skip investors who don't invest in this sector or stage
      if (
        investor.investmentSectors.length > 0 &&
        !investor.investmentSectors.includes(project.industry) &&
        !investor.investmentSectors.some((sector) =>
          project.marketSegments.includes(sector)
        )
      ) {
        continue;
      }

      if (
        investor.investmentStage.length > 0 &&
        !investor.investmentStage.includes(project.fundingStage)
      ) {
        continue;
      }

      // Skip investors whose funding range doesn't match (if specified)
      if (
        project.fundingAmount &&
        investor.investmentMaxSize &&
        project.fundingAmount > investor.investmentMaxSize
      ) {
        continue;
      }

      if (
        project.fundingAmount &&
        investor.investmentMinSize &&
        project.fundingAmount < investor.investmentMinSize
      ) {
        continue;
      }

      // Use OpenAI to calculate detailed match scores
      const matchResult = await calculateInvestorMatchScore(project, investor);

      // Add to matches if score is above threshold (e.g., 6 out of 10)
      if (matchResult.matchScore >= 6) {
        matches.push({
          investor: {
            id: investor.id,
            name: investor.name,
            companyName: investor.companyName,
            investmentSectors: investor.investmentSectors,
            matchScore: matchResult.matchScore,
            matchReasons: matchResult.reasons,
          },
        });
      }
    }

    // Sort by match score descending and limit
    return matches
      .sort((a, b) => b.investor.matchScore - a.investor.matchScore)
      .slice(0, limit);
  } catch (error) {
    console.error("Error finding matching investors:", error);
    throw new Error("Failed to match investors");
  }
}

/**
 * Use OpenAI to calculate a detailed match score between a project and an investor
 */
async function calculateInvestorMatchScore(
  project: any,
  investor: any
): Promise<InvestorMatchResult> {
  const matchingPrompt = `
  You are an expert in matching startups with the right investors.

  Analyze the compatibility between this startup project and potential investor:

  PROJECT DETAILS:
  Title: ${project.title}
  Description: ${project.description}
  Industry: ${project.industry}
  Funding Stage: ${project.fundingStage}
  Funding Amount Requested: ${project.fundingAmount || "Not specified"}
  Equity Offered: ${project.equity || "Not specified"}
  Problem Statement: ${project.problemStatement || "Not specified"}
  Solution: ${project.solution || "Not specified"}
  Target Market: ${project.targetMarket || "Not specified"}
  Business Model: ${project.businessModel || "Not specified"}
  Competitor Analysis: ${project.competitorAnalysis || "Not specified"}
  Market Segments: ${project.marketSegments.join(", ") || "Not specified"}
  Technical Stack: ${project.technicalStack.join(", ") || "Not specified"}

  investor DETAILS:
  Name: ${investor.name}
  Company: ${investor.companyName || "Independent investor"}
  Investment Sectors: ${investor.investmentSectors.join(", ")}
  Investment Stages: ${investor.investmentStage.join(", ")}
  Minimum Investment Size: ${investor.investmentMinSize || "Not specified"}
  Maximum Investment Size: ${investor.investmentMaxSize || "Not specified"}

  Please analyze and rate the compatibility between this project and investor as JSON in this format:
  {
    "matchScore": (number between 1-10, with 10 being perfect match),
    "reasons": ["reason1", "reason2", "reason3"],
    "potentialInterest": "explanation of why the investor might be interested",
    "keyInsights": "key points or questions the investor might have"
  }

  Focus on strategic alignment, market potential, and investment thesis fit.
  `;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: matchingPrompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });
  //@ts-ignore
  return JSON.parse(response.choices[0].message.content) as InvestorMatchResult;
}

/**
 * Update the AI-generated match scores in the project record
 * This is used to optimize database queries by pre-calculating scores
 */
export async function updateProjectMatchScores(
  projectId: string
): Promise<void> {
  try {
    const matchingInvestors = await findMatchingInvestors(projectId, 20);

    // Calculate overall match score based on top investors
    let avgScore = 0;
    if (matchingInvestors.length > 0) {
      avgScore =
        matchingInvestors.reduce(
          (sum, match) => sum + match.investor.matchScore,
          0
        ) / matchingInvestors.length;
    }

    // Extract key insights to generate tags
    const allMatchReasons = matchingInvestors.flatMap(
      (match) => match.investor.matchReasons
    );
    const aiTags = extractKeyTerms(allMatchReasons);

    // Update the project with AI insights
    await prisma.project.update({
      where: { id: projectId },
      data: {
        aiMatchScore: avgScore,
        aiTags: aiTags,
        aiInsights: JSON.stringify({
          topMatches: matchingInvestors.slice(0, 5).map((m) => ({
            investorName: m.investor.name,
            score: m.investor.matchScore,
            reasons: m.investor.matchReasons,
          })),
          suggestedApproach: generateApproachSuggestion(matchingInvestors),
        }),
      },
    });
  } catch (error) {
    console.error("Error updating project match scores:", error);
    throw new Error("Failed to update project match scores");
  }
}

/**
 * Helper function to extract key terms from match reasons
 */
function extractKeyTerms(matchReasons: string[]): string[] {
  const allText = matchReasons.join(" ").toLowerCase();
  const commonTerms = [
    "fintech",
    "healthtech",
    "edtech",
    "ai",
    "machine learning",
    "blockchain",
    "saas",
    "b2b",
    "b2c",
    "marketplace",
    "platform",
    "hardware",
    "software",
    "mobile",
    "web",
    "analytics",
    "data",
    "cloud",
    "enterprise",
    "consumer",
    "early-stage",
    "growth",
    "scaling",
    "seed",
    "series a",
    "impact",
  ];

  return commonTerms.filter((term) => allText.includes(term.toLowerCase()));
}

/**
 * Generate a suggestion for approaching investors based on match results
 */
function generateApproachSuggestion(matches: ProjectInvestorMatch[]): string {
  if (matches.length === 0) {
    return "Consider refining your pitch to better highlight your market opportunity and business model.";
  }

  const avgScore =
    matches.reduce((sum, m) => sum + m.investor.matchScore, 0) / matches.length;

  if (avgScore > 8) {
    return "Your project has strong investor appeal. Focus on highlighting your traction and team expertise when contacting these investors.";
  } else if (avgScore > 6) {
    return "You have good investor matches. Consider emphasizing your unique value proposition and market opportunity.";
  } else {
    return "You have moderate investor interest. Work on strengthening your business model and competitive advantages before approaching investors.";
  }
}
