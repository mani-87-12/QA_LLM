import React from "react";

const ResponseDisplay = ({ history }) => {
  return (
    <div className="max-w-5xl mx-auto p-4 pb-20">
      {history.length === 0 ? (
        <p className="text-gray-600 text-center">No prompts submitted yet</p>
      ) : (
        history.map(({ prompt, responses, similarity }, index) => (
          <div key={index} className="mb-6 flex flex-col">
            {" "}
            <div className="flex justify-between items-start mb-4">
              {" "}
              {similarity && similarity.length > 0 ? (
                <div className="flex justify-start bg-white">
                  {" "}
                  <div className="max-w-sm border rounded-lg p-4 bg-gray-50 shadow-sm text-left">
                    {" "}
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
                      {" "}
                      Similarity Score:
                    </h3>
                    <ul className="text-gray-700 prose prose-sm max-w-none">
                      {similarity.map((comp, idx) => (
                        <li key={idx}>
                          {comp.pair.toUpperCase().replace("-", " vs. ")}:{" "}
                          {comp.score !== undefined
                            ? comp.score
                            : `Error: ${comp.error}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="max-w-sm invisible"></div>
              )}
              <div className="flex justify-end">
                {" "}
                <div className="max-w-lg border rounded-lg p-4 bg-blue-50 shadow-sm">
                  <h3 className="text-md font-medium mb-2 text-blue-700">
                    Your Question
                  </h3>
                  <p className="text-gray-800">{prompt}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {["grok", "gemini"].map((model) => (
                <div
                  key={model}
                  className="border rounded-lg p-4 shadow-sm bg-white min-h-[150px] min-w-[250px]"
                >
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    {model.charAt(0).toUpperCase() + model.slice(1)}
                  </h3>
                  <div
                    className="text-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: responses[model] || "No response",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ResponseDisplay;
