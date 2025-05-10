/**
 * AI-Driven Investor-Startup Matchmaking Service
 * 
 * This service provides sophisticated AI algorithms that analyze investor preferences,
 * startup stage, sector, and traction to recommend the best-fit opportunities.
 * 
 * Features:
 * - Intelligent investor matching based on multiple factors
 * - Personalized recommendations with explanation of match reasons
 * - Support for diverse funding models (Equity, RBF, CVC, Impact)
 * - ESG/Impact investment highlighting
 */

import OpenAI from 'openai';

// Define types for matching
export interface InvestorProfile {
  id: string;
  name: string;
  interests: string[];
  previousInvestments: string[];
  investmentStages: string[];
  preferredSectors: string[];
  preferredLocations: string[];
  ticketSizeMin: number;
  ticketSizeMax: number;
  fundingModels: string[];
  esgFocus: boolean;
}

export interface StartupProfile {
  id: string;
  name: string;
  description: string;
  sector: string;
  stage: string;
  location: string;
  fundingAmount: number;
  fundingType: string;
  traction: {
    users: number;
    revenue: number;
    growth: number;
  };
  team: {
    size: number;
    experience: string;
  };
  esgImpact: 'high' | 'medium' | 'low' | null;
  tags: string[];
}

export interface MatchResult {
  score: number;
  reasons: string[];
  investorId: string;
  startupId: string;
  recommendationStrength: 'strong' | 'medium' | 'weak';
  explanation: string;
}

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Match investors to startups using AI-powered analysis
 * @param startup The startup profile to match
 * @param investors Array of investor profiles to evaluate
 * @param limit Maximum number of matches to return
 * @returns Array of MatchResult objects sorted by match score
 */
export async function matchInvestorsToStartup(
  startup: StartupProfile,
  investors: InvestorProfile[],
  limit: number = 10
): Promise<MatchResult[]> {
  // For each investor, calculate a match score
  const matches = await Promise.all(
    investors.map(async (investor) => {
      const match = await calculateMatchScore(startup, investor);
      return {
        ...match,
        investorId: investor.id,
        startupId: startup.id
      };
    })
  );

  // Sort by score and limit results
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Calculate the match score between a startup and an investor
 * @param startup The startup profile
 * @param investor The investor profile
 * @returns A match score and explanation
 */
async function calculateMatchScore(
  startup: StartupProfile,
  investor: InvestorProfile
): Promise<Omit<MatchResult, 'investorId' | 'startupId'>> {
  try {
    // Basic rule-based matching to get a baseline score
    let baseScore = 0;
    const reasons: string[] = [];

    // Match investment stage preference
    if (investor.investmentStages.includes(startup.stage)) {
      baseScore += 20;
      reasons.push(`Investor focuses on ${startup.stage} stage companies`);
    }

    // Match sector preference
    if (investor.preferredSectors.includes(startup.sector)) {
      baseScore += 25;
      reasons.push(`Investor specializes in the ${startup.sector} sector`);
    }

    // Match location preference
    if (investor.preferredLocations.includes(startup.location)) {
      baseScore += 10;
      reasons.push(`Investor prefers startups in ${startup.location}`);
    }

    // Match ticket size
    if (
      startup.fundingAmount >= investor.ticketSizeMin &&
      startup.fundingAmount <= investor.ticketSizeMax
    ) {
      baseScore += 15;
      reasons.push(`Funding amount matches investor's ticket size range`);
    }

    // Match funding model preference
    if (investor.fundingModels.includes(startup.fundingType)) {
      baseScore += 15;
      reasons.push(`Investor supports ${startup.fundingType} funding model`);
    }

    // ESG focus bonus
    if (investor.esgFocus && startup.esgImpact === 'high') {
      baseScore += 15;
      reasons.push(`Startup's high ESG impact aligns with investor's focus on impact investments`);
    }

    // Use OpenAI to enhance the matching with more nuanced analysis
    if (process.env.OPENAI_API_KEY) {
      try {
        const enhancedMatch = await enhanceMatchWithAI(startup, investor, baseScore);
        return enhancedMatch;
      } catch (error) {
        console.error('Error using AI for match enhancement:', error);
        // Fall back to rule-based matching if AI enhancement fails
      }
    }

    // Determine recommendation strength based on score
    let recommendationStrength: 'strong' | 'medium' | 'weak' = 'weak';
    if (baseScore >= 70) recommendationStrength = 'strong';
    else if (baseScore >= 40) recommendationStrength = 'medium';

    return {
      score: baseScore,
      reasons,
      recommendationStrength,
      explanation: reasons.join('. ')
    };
  } catch (error) {
    console.error('Error calculating match score:', error);
    throw error;
  }
}

/**
 * Use OpenAI to enhance matching with more sophisticated analysis
 */
async function enhanceMatchWithAI(
  startup: StartupProfile,
  investor: InvestorProfile,
  baseScore: number
): Promise<Omit<MatchResult, 'investorId' | 'startupId'>> {
  const prompt = `
    I need to analyze the match quality between a startup and an investor.
    
    Startup information:
    - Name: ${startup.name}
    - Description: ${startup.description}
    - Sector: ${startup.sector}
    - Stage: ${startup.stage}
    - Location: ${startup.location}
    - Funding amount: $${startup.fundingAmount}
    - Funding type: ${startup.fundingType}
    - Traction: ${startup.traction.users} users, $${startup.traction.revenue} revenue, ${startup.traction.growth}% growth
    - Team: ${startup.team.size} people, ${startup.team.experience} experience
    - ESG impact: ${startup.esgImpact || 'None'}
    - Tags: ${startup.tags.join(', ')}
    
    Investor information:
    - Name: ${investor.name}
    - Interests: ${investor.interests.join(', ')}
    - Previous investments: ${investor.previousInvestments.join(', ')}
    - Investment stages: ${investor.investmentStages.join(', ')}
    - Preferred sectors: ${investor.preferredSectors.join(', ')}
    - Preferred locations: ${investor.preferredLocations.join(', ')}
    - Ticket size: $${investor.ticketSizeMin} to $${investor.ticketSizeMax}
    - Funding models: ${investor.fundingModels.join(', ')}
    - ESG focus: ${investor.esgFocus ? 'Yes' : 'No'}
    
    Based on the rule-based matching, the base match score is ${baseScore}/100.
    
    Analyze this match in depth and provide:
    1. An adjusted match score (0-100)
    2. 3-5 specific reasons why this is a good or bad match
    3. A recommendation strength (strong, medium, or weak)
    4. A concise explanation of the overall match quality
    
    Return the response as a JSON object with the following format:
    {
      "score": number,
      "reasons": string[],
      "recommendationStrength": "strong" | "medium" | "weak",
      "explanation": string
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      score: result.score,
      reasons: result.reasons,
      recommendationStrength: result.recommendationStrength,
      explanation: result.explanation
    };
  } catch (error) {
    console.error('Error using OpenAI for matching:', error);
    // Fall back to rule-based matching
    const recommendationStrength = baseScore >= 70 ? 'strong' : baseScore >= 40 ? 'medium' : 'weak';
    return {
      score: baseScore,
      reasons: [`Base score calculation: ${baseScore}`],
      recommendationStrength,
      explanation: `Based on basic matching criteria, this is a ${recommendationStrength} match.`
    };
  }
}