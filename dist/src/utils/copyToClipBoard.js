export function copyToClipBoard(text) {
    if (!text) {
        navigator.clipboard.writeText("");
        return;
    }
    navigator.clipboard.writeText(text || "");
}
//# sourceMappingURL=copyToClipBoard.js.map