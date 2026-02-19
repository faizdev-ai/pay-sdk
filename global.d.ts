import { PayButton } from "./src/index.ts";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "pay-button": PayButton;
    }
  }
}

export {};
