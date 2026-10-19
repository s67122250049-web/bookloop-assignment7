// Generate a distinct, self-contained cover for books without a custom image.
// The generated image is a data URI and does not need a Firebase Storage upload.
const palettes = [
  ["#705744", "#eee0ca"], ["#4d6256", "#edf0dc"],
  ["#52627e", "#f6ebd8"], ["#795d70", "#f7e6dc"],
  ["#6c6545", "#f3ecd2"], ["#455968", "#f0e7d9"],
];

function xmlEscape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapTitle(title, maxChars = 19) {
  const words = String(title || "Untitled").split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (line && (line + " " + word).length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? line + " " + word : word;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

export function getBookCover(book = {}) {
  const original = typeof book.cover === "string" ? book.cover.trim() : "";
  const title = String(book.title || "Untitled");
  // The old add-book form saved Harry Potter's file path for every new book.
  const isIncorrectDefault = original.endsWith("/book_001_thumb.svg") &&
    !/harry potter/i.test(title);
  if (original && !isIncorrectDefault) return original;

  const seed = Array.from(title).reduce((sum, c) => sum + c.codePointAt(0), 0);
  const [bg, fg] = palettes[seed % palettes.length];
  const lines = wrapTitle(title);
  const titleSvg = lines.map((line, i) =>
    `<text x="38" y="${240 + i * 42}" fill="${fg}" font-family="Georgia,serif" font-size="32" font-weight="bold">${xmlEscape(line)}</text>`
  ).join("");
  const author = xmlEscape(String(book.author || "").slice(0, 48));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="500" viewBox="0 0 360 500">
    <rect width="360" height="500" fill="${bg}"/>
    <rect x="18" y="18" width="324" height="464" fill="none" stroke="${fg}" stroke-opacity="0.72" stroke-width="2"/>
    <text x="38" y="66" fill="${fg}" font-family="Georgia,serif" font-size="13" letter-spacing="3">BOOKLOOP</text>
    <path d="M180 120 L190 143 L213 153 L190 163 L180 186 L170 163 L147 153 L170 143 Z" fill="none" stroke="${fg}" stroke-width="2"/>
    ${titleSvg}
    <text x="38" y="443" fill="${fg}" font-family="Georgia,serif" font-size="17">${author}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
