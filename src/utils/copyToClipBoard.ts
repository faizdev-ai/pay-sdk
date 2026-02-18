export function copyToClipBoard(text: string) {
  if (!text) {
    navigator.clipboard.writeText("");
    return;
  }
  navigator.clipboard.writeText(text || "");
}
