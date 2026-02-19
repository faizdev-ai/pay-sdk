import { toast } from "lit-toaster";
export function copyToClipBoard(text) {
    if (!text) {
        navigator.clipboard.writeText("");
        return;
    }
    navigator.clipboard.writeText(text || "");
    toast.show("Copied successfully.");
}
//# sourceMappingURL=copyToClipBoard.js.map