import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import "../pay-modals/index.js";
@customElement("pay-button")
export class PayButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      padding: var(--pay-btn-padding, 10px 20px);
      background: var(--pay-btn-bg, hsl(45 93% 47%));
      color: var(--pay-btn-color, #fff);
      border: var(--pay-btn-border, none);
      border-radius: var(--pay-btn-radius, 6px);
      cursor: pointer;
      font-size: var(--pay-btn-font-size, 14px);
      width: var(--pay-btn-width, 100%);
      height: var(--pay-btn-height, 100%);
    }
  `;

  @property({ type: String }) btnTxt = "Pay Now";
  @property({ type: Number }) amount = 0;
  @property({ type: String })
  paymentToken = "";
  @query("crypto-pay")
  private cryptoPay!: any;

  private openDialog() {
    // console.log(this.cryptoPay, "asdasdad");
    this.cryptoPay?.open();
  }

  private handleSuccess(e: CustomEvent) {
    console.log("Payment success:", e.detail);
  }

  private handleFailure() {
    console.log("Payment failed");
  }

  render() {
    return html`
      <button part="button" @click=${this.openDialog}>${this.btnTxt}</button>
      <crypto-pay
        @payment-success=${this.handleSuccess}
        @payment-failed=${this.handleFailure}
        .paymentToken=${this.paymentToken}
        .amount=${this.amount}
      ></crypto-pay>
    `;
  }
}
