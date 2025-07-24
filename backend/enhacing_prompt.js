export function constructEnhancedPrompt(userPrompt, classifiedType) {
  let suffix = "";

  switch (classifiedType) {
    case "WH_QUESTION":
      suffix =
        " Provide a direct, factual answer. Be concise and limit your response to 2-3 sentences, focusing only on the essential information. Format as a concise paragraph or short bullet points in Markdown.";
      break;
    case "YES_NO_QUESTION":
      suffix =
        " Answer only 'Yes' or 'No', followed by a very brief, single-sentence explanation if necessary. Do not elaborate or provide introductory/concluding remarks.";
      break;
    case "ONE_WORD_ANSWER":
      suffix =
        " Provide a single word answer. If a single word isn't appropriate, give the shortest possible factual answer. Do not include any additional text or punctuation beyond the answer itself.";
      break;
    case "DESCRIPTIVE_QUESTION":
      suffix =
        " Explain thoroughly but concisely. Organize your explanation into 2-3 concise paragraphs, or approximately 150-200 words. Use clear and direct language.";
      break;
    case "OPINION_BASED_QUESTION":
      suffix =
        " Provide a balanced, brief opinion or perspective. Acknowledge different viewpoints if applicable. Limit to 2-3 sentences. Avoid verbose phrasing.";
      break;
    case "PROCEDURAL_QUESTION":
      suffix =
        " Provide a clear, numbered list of steps in Markdown. Be brief and to the point for each step, and keep the total steps under 7-8. Do not include extra conversational text.";
      break;
    case "DEFINITION_QUESTION":
      suffix =
        " Provide a concise definition, then one short sentence of context or an example. Limit to 2-3 sentences total. Present in a direct, factual manner.";
      break;
    case "COMPARATIVE_QUESTION":
      suffix =
        " Briefly compare and contrast the two subjects, highlighting key similarities and differences in 3-5 concise bullet points in Markdown.";
      break;
    default:
      suffix =
        " Provide a meaningful and concise answer, avoiding unnecessary details or conversational filler. Aim for 3-5 sentences.";
      break;
  }
  return `${userPrompt}\n${suffix}`;
}
