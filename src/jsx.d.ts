import type { PayButton } from "./pay-button/index.ts";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "pay-button": Partial<PayButton> & {
        ref?: React.Ref<HTMLElement>;
      };
    }
  }
}

export {};
