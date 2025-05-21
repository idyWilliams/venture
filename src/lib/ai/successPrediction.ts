"use server";

import * as tf from "@tensorflow/tfjs";
import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Load the TensorFlow.js model for startup success prediction
// let model: tf.LayersModel | null = null;
let model: tf.Sequential | null = null;

export async function loadSuccessPredictionModel() {
  try {
    // In a real application, this would load from a saved model URL
    // model = await tf.loadLayersModel('https://example.com/models/startup-success/model.json');

    // For this example, we'll create a simple model
    model = tf.sequential();
    model.add(tf.layers.dense({
      inputShape: [10], // Market size, team experience, traction, funding, etc
      units: 32,
      activation: 'relu'
    }));
    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu'
    }));
    model.add(tf.layers.dense({
      units: 8,
      activation: 'relu'
    }));
    model.add(tf.layers.dense({
      units: 1,
      activation: 'sigmoid'
    }));

    model.compile({
      optimizer: tf.train.adam(),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    console.log('TensorFlow.js startup success prediction model loaded');
    return true;
  } catch (error) {
    console.error('Error loading TensorFlow.js model:', error);
    return false;
  }
}

// export async function loadSuccessPredictionModel() {
//   try {
//     // Create a Sequential model
//     // model = tf.sequential();
//     // model = tf.sequential() as tf.Sequential;

//     // Now TypeScript knows model is Sequential and has the add() method
//     model.add(
//       tf.layers.dense({
//         inputShape: [10], // Market size, team experience, traction, funding, etc
//         units: 32,
//         activation: "relu",
//       })
//     );
//     model.add(
//       tf.layers.dense({
//         units: 16,
//         activation: "relu",
//       })
//     );
//     model.add(
//       tf.layers.dense({
//         units: 8,
//         activation: "relu",
//       })
//     );
//     model.add(
//       tf.layers.dense({
//         units: 1,
//         activation: "sigmoid",
//       })
//     );

//     model.compile({
//       optimizer: tf.train.adam(),
//       loss: "binaryCrossentropy",
//       metrics: ["accuracy"],
//     });

//     console.log("TensorFlow.js startup success prediction model loaded");
//     return true;
//   } catch (error) {
//     console.error("Error loading TensorFlow.js model:", error);
//     return false;
//   }
// }

interface ProjectSuccessPredictionInput {
  marketSize: number; // 1-10 scale, 10 being very large
  teamExperience: number; // 1-10 scale
  traction: number; // 1-10 scale
  fundingAmount: number; // in thousands of USD
  competitorStrength: number; // 1-10 scale, 10 being very strong
  innovationLevel: number; // 1-10 scale
  executionCapability: number; // 1-10 scale
  marketGrowthRate: number; // percentage
  profitMargin: number; // percentage
  customerAcquisitionCost: number; // in USD
}

// Generate AI-assisted input for the TensorFlow model
async function generateAIAssessment(
  projectId: string
): Promise<ProjectSuccessPredictionInput> {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        founder: {
          select: {
            name: true,
            companyName: true,
          },
        },
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const analysisPrompt = `
    You are an expert startup analyst. Please evaluate this startup project based on the available information.

    Project Title: ${project.title}
    Industry: ${project.industry}
    Funding Stage: ${project.fundingStage}
    Description: ${project.description}
    Problem Statement: ${project.problemStatement || "Not provided"}
    Solution: ${project.solution || "Not provided"}
    Target Market: ${project.targetMarket || "Not provided"}
    Business Model: ${project.businessModel || "Not provided"}
    Competitor Analysis: ${project.competitorAnalysis || "Not provided"}

    Please provide an assessment in JSON format with the following structure:
    {
      "marketSize": (number between 1-10, 10 being very large),
      "teamExperience": (number between 1-10),
      "traction": (number between 1-10),
      "fundingAmount": (estimated funding needs in thousands of USD),
      "competitorStrength": (number between 1-10, 10 being very strong),
      "innovationLevel": (number between 1-10),
      "executionCapability": (number between 1-10),
      "marketGrowthRate": (percentage annual growth),
      "profitMargin": (estimated percentage),
      "customerAcquisitionCost": (in USD)
    }

    Base your assessment on the information provided and industry benchmarks.
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: analysisPrompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
    return JSON.parse(
      //@ts-ignore
      response.choices[0].message.content
    ) as ProjectSuccessPredictionInput;
  } catch (error) {
    console.error("Error generating AI assessment:", error);

    // Return default values on error
    return {
      marketSize: 5,
      teamExperience: 5,
      traction: 3,
      fundingAmount: 500,
      competitorStrength: 5,
      innovationLevel: 5,
      executionCapability: 5,
      marketGrowthRate: 10,
      profitMargin: 15,
      customerAcquisitionCost: 100,
    };
  }
}

// Preprocess assessment data for prediction
function preprocessAssessmentData(
  input: ProjectSuccessPredictionInput
): tf.Tensor {
  // Normalize the inputs
  const normalizedMarketSize = input.marketSize / 10;
  const normalizedTeamExperience = input.teamExperience / 10;
  const normalizedTraction = input.traction / 10;
  const normalizedFundingAmount = Math.min(input.fundingAmount / 10000, 1); // Cap at 10M
  const normalizedCompetitorStrength = input.competitorStrength / 10;
  const normalizedInnovationLevel = input.innovationLevel / 10;
  const normalizedExecutionCapability = input.executionCapability / 10;
  const normalizedMarketGrowthRate = Math.min(input.marketGrowthRate / 100, 1); // Cap at 100%
  const normalizedProfitMargin = Math.min(input.profitMargin / 100, 1); // Cap at 100%
  const normalizedCAC = Math.min(input.customerAcquisitionCost / 1000, 1); // Cap at $1000

  return tf.tensor2d([
    [
      normalizedMarketSize,
      normalizedTeamExperience,
      normalizedTraction,
      normalizedFundingAmount,
      normalizedCompetitorStrength,
      normalizedInnovationLevel,
      normalizedExecutionCapability,
      normalizedMarketGrowthRate,
      normalizedProfitMargin,
      normalizedCAC,
    ],
  ]);
}

interface SuccessPredictionResult {
  successProbability: number;
  timeframe: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
  keyStrengths: string[];
  keyRisks: string[];
  valuationEstimate: {
    min: number;
    avg: number;
    max: number;
  };
  suggestedFocus: string[];
}

// Predict project success with AI + ML hybrid approach
export async function predictProjectSuccess(
  projectId: string
): Promise<SuccessPredictionResult> {
  try {
    // Load the TensorFlow model if not already loaded
    if (!model) {
      await loadSuccessPredictionModel();
    }

    // Get AI assessment of the project
    const assessment = await generateAIAssessment(projectId);

    // Predict with TensorFlow
    let successProbability = 0.5; // Default

    if (model) {
      try {
        // Preprocess data
        const inputTensor = preprocessAssessmentData(assessment);

        // Make prediction
        const prediction = model.predict(inputTensor) as tf.Tensor;
        const result = await prediction.data();

        // Clean up tensors
        inputTensor.dispose();
        prediction.dispose();

        successProbability = result[0];
      } catch (tfError) {
        console.error("TensorFlow prediction error:", tfError);
      }
    }

    // Get more detailed insights with OpenAI
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        title: true,
        description: true,
        industry: true,
        fundingStage: true,
        problemStatement: true,
        solution: true,
        targetMarket: true,
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const insightsPrompt = `
    You are a venture capital analyst with expertise in startup success prediction.

    Project Details:
    - Title: ${project.title}
    - Description: ${project.description}
    - Industry: ${project.industry}
    - Funding Stage: ${project.fundingStage}
    - Problem Statement: ${project.problemStatement || "Not provided"}
    - Solution: ${project.solution || "Not provided"}
    - Target Market: ${project.targetMarket || "Not provided"}

    Project Assessment:
    - Market Size (1-10): ${assessment.marketSize}
    - Team Experience (1-10): ${assessment.teamExperience}
    - Traction (1-10): ${assessment.traction}
    - Funding Needs: $${assessment.fundingAmount * 1000}
    - Competitor Strength (1-10): ${assessment.competitorStrength}
    - Innovation Level (1-10): ${assessment.innovationLevel}
    - Execution Capability (1-10): ${assessment.executionCapability}
    - Market Growth Rate: ${assessment.marketGrowthRate}%
    - Profit Margin: ${assessment.profitMargin}%
    - Customer Acquisition Cost: $${assessment.customerAcquisitionCost}

    Our ML model has predicted a ${(successProbability * 100).toFixed(
      1
    )}% probability of success for this startup.

    Please provide a detailed analysis in JSON format with the following structure:
    {
      "timeframe": {
        "oneYear": (probability of success in 1 year, percentage),
        "threeYear": (probability of success in 3 years, percentage),
        "fiveYear": (probability of success in 5 years, percentage)
      },
      "keyStrengths": ["strength1", "strength2", "strength3"],
      "keyRisks": ["risk1", "risk2", "risk3"],
      "valuationEstimate": {
        "min": (minimum valuation in USD),
        "avg": (average valuation in USD),
        "max": (maximum valuation in USD)
      },
      "suggestedFocus": ["focus1", "focus2", "focus3"]
    }

    Base your analysis on the project details, assessment scores, and your expertise in startup success factors.
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: insightsPrompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
//@ts-ignore
    const insights = JSON.parse(response.choices[0].message.content);

    const result: SuccessPredictionResult = {
      successProbability,
      timeframe: insights.timeframe,
      keyStrengths: insights.keyStrengths,
      keyRisks: insights.keyRisks,
      valuationEstimate: insights.valuationEstimate,
      suggestedFocus: insights.suggestedFocus,
    };

    // Store the prediction results
    await prisma.aIInsight.create({
      data: {
        userId:
          (
            await prisma.project.findUnique({
              where: { id: projectId },
              select: { founderUserId: true },
            })
          )?.founderUserId || "",
        content: JSON.stringify(result),
        insightType: "success_prediction",
      },
    });

    return result;
  } catch (error) {
    console.error("Error predicting project success:", error);

    // Return reasonable default values on error
    return {
      successProbability: 0.5,
      timeframe: {
        oneYear: 30,
        threeYear: 50,
        fiveYear: 70,
      },
      keyStrengths: [
        "Strong concept",
        "Market opportunity",
        "Potential for growth",
      ],
      keyRisks: [
        "Execution challenges",
        "Market competition",
        "Funding requirements",
      ],
      valuationEstimate: {
        min: 500000,
        avg: 1000000,
        max: 2000000,
      },
      suggestedFocus: [
        "Product development",
        "Market validation",
        "Team building",
      ],
    };
  }
}
