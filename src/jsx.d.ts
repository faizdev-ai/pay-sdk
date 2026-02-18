declare global {
  namespace JSX {
    interface IntrinsicElements {
      "pay-button": {
        btnTxt?: string;
        amount?: number;
        paymentToken?: string;
      } & Partial<HTMLElement>;
    }
  }
}

export {};
