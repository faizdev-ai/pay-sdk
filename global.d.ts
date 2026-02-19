declare global {
  namespace JSX {
    interface PayButtonProps {
      btnTxt?: String;
      amount: number;
      paymentToken: String;
    }
    interface IntrinsicElements {
      "pay-button": PayButtonProps;
    }
  }
}
