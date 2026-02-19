import { PayButtonProps } from "./src/index.ts";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "pay-button": PayButtonProps;
    }
  }
}

export {};
