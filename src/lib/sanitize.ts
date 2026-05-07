import sanitizeHtml from "sanitize-html";
export function sanitize(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "span",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height", "loading"],
      span: ["style", "class"],
      "*": ["class", "style", "id"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^left$/, /^right$/, /^center$/],
        "font-size": [/^\d+(?:px|em|%)$/],
      },
    },
  });
}
