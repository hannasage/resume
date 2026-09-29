// XML 1.0 forbids these control characters outright; no amount of
// escaping makes them legal, so strip them before escaping the rest.
// U+FFFE and U+FFFF are permanently non-characters in Unicode, and a
// surrogate code unit with no matching half of its pair cannot be
// re-encoded as a valid character, so both are stripped the same way.
const XML_ILLEGAL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F￾￿]/g;
const LONE_HIGH_SURROGATE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g;
const LONE_LOW_SURROGATE = /(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g;

export function escapeXml(value: string): string {
  return value
    .replace(XML_ILLEGAL_CHARS, "")
    .replace(LONE_HIGH_SURROGATE, "")
    .replace(LONE_LOW_SURROGATE, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
