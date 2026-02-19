import { __decorate } from "tslib";
import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import "../pay-modals/index.js";
let PayButton = class PayButton extends LitElement {
    constructor() {
        super(...arguments);
        this.btnTxt = "Pay Now";
        this.amount = 0;
        this.paymentToken = "";
        this.dialogEnabled = false;
    }
    openDialog() {
        // console.log(this.cryptoPay, "asdasdad");
        this.dialogEnabled = true;
        setTimeout(() => {
            this.cryptoPay?.open();
        }, 1000);
    }
    handleSuccess(e) {
        this.dialogEnabled = false;
        console.log("Payment success:", e.detail);
    }
    handleFailure() {
        this.dialogEnabled = false;
        console.log("Payment failed");
    }
    handleClose() {
        console.log("handled>>");
        this.dialogEnabled = false;
    }
    render() {
        return html `
      <button part="button" @click=${this.openDialog}>${this.btnTxt}</button>
      ${this.dialogEnabled
            ? html `<crypto-pay
            @payment-success=${this.handleSuccess}
            @payment-failed=${this.handleFailure}
            @onClose=${this.handleClose}
            .paymentToken=${this.paymentToken}
            .amount=${this.amount}
          ></crypto-pay>`
            : html ``}
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
    property({ type: String })
], PayButton.prototype, "paymentToken", void 0);
__decorate([
    query("crypto-pay")
], PayButton.prototype, "cryptoPay", void 0);
__decorate([
    state()
], PayButton.prototype, "dialogEnabled", void 0);
PayButton = __decorate([
    customElement("pay-button")
], PayButton);
export { PayButton };
//# sourceMappingURL=index.js.map