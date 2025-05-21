import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Moderates text content to detect and filter inappropriate or toxic content
 * @param text The text content to moderate
 * @returns A moderation result with toxicity scores and flags
 */
export async function moderateContent(text: string): Promise<{
  isFlagged: boolean;
  categories: Record<string, boolean>;
  scores: Record<string, number>;
}> {
  try {
    const response = await openai.moderations.create({
      input: text,
    });

    const result = response.results[0];
    return {
      isFlagged: result.flagged,
      //@ts-ignore
      categories: result.categories,
      //@ts-ignore
      scores: result.category_scores,
    };
  } catch (error) {
    console.error("OpenAI moderation error:", error);
    // Default to flagging content on error for safety
    return {
      isFlagged: true,
      categories: { error: true },
      scores: { error: 1.0 },
    };
  }
}

/**
 * Analyzes text sentiment and calculates scores for engagement potential
 * @param text The text content to analyze
 */
export async function analyzeEngagementPotential(text: string): Promise<{
  score: number;
  feedback: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert startup pitch analyst. Analyze the given text and evaluate its engagement potential on a scale of 1-100. Provide a score and brief feedback on how to improve. Respond with JSON in this format: { 'score': number, 'feedback': string }"
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });
//@ts-ignore
    const result = JSON.parse(response.choices[0].message.content);
    return {
      score: Math.min(100, Math.max(1, result.score)),
      feedback: result.feedback
    };
  } catch (error) {
    console.error("OpenAI engagement analysis error:", error);
    return {
      score: 50,
      feedback: "Unable to analyze engagement potential at this time."
    };
  }
}
