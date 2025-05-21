import * as tf from "@tensorflow/tfjs";

// Load the TensorFlow.js model for engagement prediction
// let model: tf.LayersModel | null = null;
let model: tf.Sequential | null = null;

export async function loadEngagementModel() {
  try {
    // In a real application, this would load from a saved model URL
    // model = await tf.loadLayersModel('https://example.com/models/engagement/model.json');

    // For this example, we'll create a simple model
    model = tf.sequential();
    model.add(
      tf.layers.dense({
        inputShape: [4], // Views, likes, comments, time spent
        units: 16,
        activation: "relu",
      })
    );
    model.add(
      tf.layers.dense({
        units: 8,
        activation: "relu",
      })
    );
    model.add(
      tf.layers.dense({
        units: 1,
        activation: "sigmoid",
      })
    );

    model.compile({
      optimizer: tf.train.adam(),
      loss: "binaryCrossentropy",
      metrics: ["accuracy"],
    });

    console.log("TensorFlow.js engagement model loaded");
    return true;
  } catch (error) {
    console.error("Error loading TensorFlow.js model:", error);
    return false;
  }
}

// Preprocess engagement metrics for prediction
function preprocessEngagementData(
  views: number,
  likes: number,
  comments: number,
  timeSpentSeconds: number
): tf.Tensor {
  // Normalize the inputs
  const normalizedViews = views / 100; // Assuming 100 views is a good benchmark
  const normalizedLikes = likes / 20; // Assuming 20 likes is a good benchmark
  const normalizedComments = comments / 10; // Assuming 10 comments is a good benchmark
  const normalizedTimeSpent = timeSpentSeconds / 300; // Assuming 5 minutes is a good benchmark

  return tf.tensor2d([
    [normalizedViews, normalizedLikes, normalizedComments, normalizedTimeSpent],
  ]);
}

// Predict investor interest based on engagement metrics
export async function predictInvestorInterest(
  views: number,
  likes: number,
  comments: number,
  timeSpentSeconds: number
): Promise<number> {
  if (!model) {
    await loadEngagementModel();
  }

  if (!model) {
    console.error("Model not loaded");
    return 0.5; // Default to 50% if model fails to load
  }

  try {
    // Preprocess data
    const inputTensor = preprocessEngagementData(
      views,
      likes,
      comments,
      timeSpentSeconds
    );

    // Make prediction
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const result = await prediction.data();

    // Clean up tensors
    inputTensor.dispose();
    prediction.dispose();

    // Return prediction (0-1 representing interest level)
    return result[0];
  } catch (error) {
    console.error("Prediction error:", error);
    return 0.5; // Default to 50% on error
  }
}

// Analyze which features contributed most to engagement
export async function analyzeEngagementFactors(
  views: number,
  likes: number,
  comments: number,
  timeSpentSeconds: number
): Promise<Record<string, number>> {
  // A simple feature importance calculation
  const total = views + likes * 5 + comments * 10 + timeSpentSeconds / 60;

  return {
    views: (views / total) * 100,
    likes: ((likes * 5) / total) * 100,
    comments: ((comments * 10) / total) * 100,
    timeSpent: (timeSpentSeconds / 60 / total) * 100,
  };
}
