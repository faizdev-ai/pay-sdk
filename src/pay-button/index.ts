import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
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
  @state()
  dialogEnabled = false;
  private openDialog() {
    // console.log(this.cryptoPay, "asdasdad");
    this.dialogEnabled = true;
    setTimeout(() => {
      this.cryptoPay?.open();
    }, 1000);
  }

  private handleSuccess(e: CustomEvent) {
    this.dialogEnabled = false;
    console.log("Payment success:", e.detail);
  }

  private handleFailure() {
    this.dialogEnabled = false;
    console.log("Payment failed");
  }
  private handleClose() {
    console.log("handled>>");

    this.dialogEnabled = false;
  }

  render() {
    return html`
      <button part="button" @click=${this.openDialog}>${this.btnTxt}</button>
      ${this.dialogEnabled
        ? html`<crypto-pay
            @payment-success=${this.handleSuccess}
            @payment-failed=${this.handleFailure}
            @onClose=${this.handleClose}
            .paymentToken=${this.paymentToken}
            .amount=${this.amount}
          ></crypto-pay>`
        : html``}
    `;
  }
}
