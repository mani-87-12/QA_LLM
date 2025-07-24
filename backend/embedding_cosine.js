let pipeline;

let embedderInstance;

(async () => {
  try {
    const transformersModule = await import("@xenova/transformers");
    pipeline = transformersModule.pipeline;

    console.log("Loading model: all-MiniLM-L6-v2...");
    embedderInstance = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    console.log("Model loaded successfully for embedding.");
  } catch (error) {
    console.error("Error loading transformers model:", error);
    embedderInstance = null;
  }
})();

const getEmbedding = async (text) => {
  if (!embedderInstance) {
    throw new Error("Embedding model not loaded.");
  }
  if (!text || typeof text !== "string" || text.trim() === "") {
    console.warn("The input was empty or invalid. Returning a zero vector.");
    return new Array(384).fill(0);
  }

  try {
    const output = await embedderInstance(text, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(output.data);
  } catch (error) {
    console.error("Error generating embedding with transformers:", error);
    throw new Error(`Embedding generation failed: ${error.message}`);
  }
};

const calculateCosineSimilarity = (vecA, vecB) => {
  if (
    !vecA ||
    !vecB ||
    vecA.length === 0 ||
    vecB.length === 0 ||
    vecA.length !== vecB.length
  ) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
};

export default {
  getEmbedding,
  calculateCosineSimilarity,
};
