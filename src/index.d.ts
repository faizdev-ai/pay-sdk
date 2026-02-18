import type { PayButton } from "./pay-button";

declare global {
  interface HTMLElementTagNameMap {
    "pay-button": PayButton;
  }
}

export {};
