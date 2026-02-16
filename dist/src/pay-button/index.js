import { __decorate } from "tslib";
import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import "../pay-modals/index.js";
let PayButton = class PayButton extends LitElement {
    constructor() {
        super(...arguments);
        this.btnTxt = "Pay Now";
        this.amount = 0;
        this.paymentToken = "";
    }
    openDialog() {
        // console.log(this.cryptoPay, "asdasdad");
        this.cryptoPay?.open();
    }
    handleSuccess(e) {
        console.log("Payment success:", e.detail);
    }
    handleFailure() {
        console.log("Payment failed");
    }
    render() {
        return html `
      <button part="button" @click=${this.openDialog}>${this.btnTxt}</button>
      <crypto-pay
        @payment-success=${this.handleSuccess}
        @payment-failed=${this.handleFailure}
        .paymentToken=${this.paymentToken}
        .amount=${this.amount}
      ></crypto-pay>
    `;
    }
};
PayButton.styles = css `
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
__decorate([
    property({ type: String })
], PayButton.prototype, "btnTxt", void 0);
__decorate([
    property({ type: Number })
], PayButton.prototype, "amount", void 0);
__decorate([
    query("crypto-pay")
], PayButton.prototype, "cryptoPay", void 0);
__decorate([
    property({ type: String })
], PayButton.prototype, "paymentToken", void 0);
PayButton = __decorate([
    customElement("pay-button")
], PayButton);
export { PayButton };
//# sourceMappingURL=index.js.map