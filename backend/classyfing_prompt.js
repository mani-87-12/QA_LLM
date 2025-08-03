const callHuggingFace = require("./huggingFace");

const QUESTION_TYPES = [
  "WH_QUESTION",
  "YES_NO_QUESTION",
  "ONE_WORD_ANSWER",
  "DESCRIPTIVE_QUESTION",
  "ANALYTIC_QUESTION",
  "OPINION_BASED_QUESTION",
  "PROCEDURAL_QUESTION",
  "DEFINITION_QUESTION",
  "COMPARATIVE_QUESTION",
];

const classifyPromptType = async (userPrompt) => {
  const classificationPrompt = `Classify the following user query into one of these categories: ${QUESTION_TYPES.join(
    ", "
  )}. Respond with ONLY the category name. If none fit perfectly, choose the closest.

    User Query: "${userPrompt}"
    Category:`;

  try {
    const response = await callHuggingFace(classificationPrompt);
    const classifiedType = response.trim().toUpperCase();

    if (QUESTION_TYPES.includes(classifiedType)) {
      return classifiedType;
    } else {
      console.warn(
        `LLM classified as unknown type: ${classifiedType}. Defaulting to DESCRIPTIVE_QUESTION.`
      );
      return "DESCRIPTIVE_QUESTION";
    }
  } catch (error) {
    console.error("Error during prompt classification by LLM:", error.message);
    return "DESCRIPTIVE_QUESTION";
  }
};

module.exports = classifyPromptType;
