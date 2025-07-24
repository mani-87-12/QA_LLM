const marked = require("marked");
const sanitizeHtml = require("sanitize-html");

function markdownToCleanHtml(markdown) {
  const rawHtml = marked.parse(markdown);
  const cleanHtml = sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      a: ["href", "name", "target"],
      img: ["src", "alt"],
    },
  });
  return cleanHtml;
}

module.exports = {
  markdownToCleanHtml,
};
