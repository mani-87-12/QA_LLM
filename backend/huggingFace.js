let pipeline = null;
let llmInstance;

(async () => {
  try {
    const transformersModule = await import("@xenova/transformers");
    pipeline = transformersModule.pipeline;

    console.log("Loading model: distilgpt2...");
    llmInstance = await pipeline("text-generation", "Xenova/distilgpt2");
    console.log("Model loaded successfully for classifying.");
  } catch (error) {
    console.error("Error loading transformers model:", error);
    llmInstance = null;
    throw new Error("Failed to load the model.");
  }
})();

const callHuggingFace = async (prompt) => {
  if (!llmInstance) {
    throw new Error("Model not loaded.");
  }
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    console.warn("The input was empty or invalid.");
  }

  try {
    const output = await llmInstance(prompt, {
      temperature: 0.1,
      do_sample: false,
    });

    return output[0].generated_text;
  } catch (err) {
    console.error(`Error with Hugging Face transformers.js: ${err.message}`);
    throw new Error(
      "Failed to generate text with Hugging Face transformers.js."
    );
  }
};
module.exports = { callHuggingFace };
