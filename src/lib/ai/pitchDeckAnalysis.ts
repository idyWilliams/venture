"use server";

import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

interface PitchDeckAnalysisResult {
  overallScore: number;
  clarity: {
    score: number;
    feedback: string;
  };
  marketFit: {
    score: number;
    feedback: string;
  };
  businessModel: {
    score: number;
    feedback: string;
  };
  teamAssessment: {
    score: number;
    feedback: string;
  };
  competitiveAnalysis: {
    score: number;
    feedback: string;
  };
  financials: {
    score: number;
    feedback: string;
  };
  presentation: {
    score: number;
    feedback: string;
  };
  keyStrengths: string[];
  areasForImprovement: string[];
  investorAppealSummary: string;
}

/**
 * Analyzes a pitch deck and provides detailed feedback
 * @param deckUrl URL to the pitch deck (can be PDF or presentation)
 * @param projectId The ID of the project being analyzed
 * @param projectDescription Brief description of the project for context
 */
export async function analyzePitchDeck(
  deckUrl: string,
  projectId: string,
  projectDescription: string
): Promise<PitchDeckAnalysisResult> {
  try {
    // For demo purposes, we'd typically extract text from the PDF or presentation
    // Here we'll use a simplified version where we assume the deckUrl is accessible

    // Get the project details to provide more context
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        title: true,
        industry: true,
        fundingStage: true,
        description: true,
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // In a real implementation, we would extract text from the deck
    // For now, we'll use the project details as context
    const analysisPrompt = `
    You are an expert venture capital analyst assessing a startup pitch deck.

    Project Title: ${project.title}
    Industry: ${project.industry}
    Funding Stage: ${project.fundingStage}
    Description: ${project.description}
    Additional Context: ${projectDescription}

    The pitch deck is available at: ${deckUrl}

    Please provide a comprehensive analysis of this pitch in JSON format with the following structure:
    {
      "overallScore": (a number between 1-10),
      "clarity": {
        "score": (1-10),
        "feedback": "detailed feedback on the clarity of the pitch"
      },
      "marketFit": {
        "score": (1-10),
        "feedback": "feedback on product-market fit"
      },
      "businessModel": {
        "score": (1-10),
        "feedback": "analysis of the business model"
      },
      "teamAssessment": {
        "score": (1-10),
        "feedback": "assessment of the team's capabilities"
      },
      "competitiveAnalysis": {
        "score": (1-10),
        "feedback": "analysis of competitive positioning"
      },
      "financials": {
        "score": (1-10),
        "feedback": "assessment of financial projections"
      },
      "presentation": {
        "score": (1-10),
        "feedback": "feedback on presentation quality"
      },
      "keyStrengths": ["strength1", "strength2", "strength3"],
      "areasForImprovement": ["area1", "area2", "area3"],
      "investorAppealSummary": "A concise summary of why investors would or wouldn't be interested"
    }

    Be critical but constructive, focusing on actionable improvements. Keep each feedback section under 150 words.
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: analysisPrompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
//@ts-ignore
    const analysisResult = JSON.parse(response.choices[0].message.content) as PitchDeckAnalysisResult;

    // Save the analysis to the database
    await prisma.pitchDeckReview.create({
      data: {
        projectId,
        deckUrl,
        reviewContent: JSON.stringify(analysisResult),
        score: analysisResult.overallScore,
      },
    });

    // Update the project with the feedback
    await prisma.project.update({
      where: { id: projectId },
      data: {
        pitchDeckFeedback: JSON.stringify(analysisResult),
      },
    });

    return analysisResult;
  } catch (error) {
    console.error("Error analyzing pitch deck:", error);
    throw new Error("Failed to analyze pitch deck");
  }
}

/**
 * Retrieves the latest pitch deck analysis for a project
 * @param projectId The ID of the project
 */
export async function getLatestPitchDeckAnalysis(projectId: string): Promise<PitchDeckAnalysisResult | null> {
  try {
    const pitchReview = await prisma.pitchDeckReview.findFirst({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });

    if (!pitchReview) {
      return null;
    }

    return JSON.parse(pitchReview.reviewContent) as PitchDeckAnalysisResult;
  } catch (error) {
    console.error("Error fetching pitch deck analysis:", error);
    return null;
  }
}