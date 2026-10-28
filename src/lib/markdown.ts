import "server-only";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/** Markdown do admin viết → HTML đã lọc, an toàn để chèn vào trang. */
export function renderMarkdown(md: string): string {
  const html = marked.parse(md, { async: false, gfm: true, breaks: false });
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h2", "h3"]),
    allowedAttributes: { a: ["href", "title", "target", "rel"], img: ["src", "alt", "title", "width", "height", "loading"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: (tag, attrs) => ({
        tagName: "a",
        attribs: /^https?:/.test(attrs.href ?? "") ? { ...attrs, target: "_blank", rel: "noopener noreferrer" } : attrs,
      }),
      img: (tag, attrs) => ({ tagName: "img", attribs: { ...attrs, loading: "lazy" } }),
    },
  });
}
