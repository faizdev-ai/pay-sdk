import { __decorate } from "tslib";
import { LitElement, html } from "lit";
import { customElement, state, query, property } from "lit/decorators.js";
import { UseApi } from "../hooks/use-api.js";
import { UseExchangeRate } from "../hooks/useExchangeRate.js";
import { cryptoPayStyles } from "./crypto-pay.styles.js";
import "../components/app-loader.js";
import "../components/close-button.js";
import { UseExpire } from "../hooks/use-expire.js";
import { UseGetTransactionById } from "../hooks/use-gettransactionbyid.js";
import "../components/wifi-loader.js";
const TIMER = 10;
let CryptoPay = class CryptoPay extends LitElement {
    constructor() {
        super(...arguments);
        this.step = 1;
        this.paymentToken = "";
        this.selectedCrypto = {};
        // @state() private amount = 10;
        this.amount = 0;
        this.qrInfo = {};
        this.enabled = true;
        this.isDialogOpen = false;
        this.qrWalletAddress = "";
        this.transaction = new UseGetTransactionById(this);
        this.tokenList = new UseApi(this, `/transaction/allowed-tokens/`, {
            requestInit: {},
            params: {
                token: this.paymentToken,
            },
            enabled: !!this.paymentToken,
            deps: [this.paymentToken],
        });
        this.exchange = new UseExchangeRate(this, "BTC");
        this.expire = new UseExpire(this, {
            expireTime: Date.now() + 1000 * 60 * TIMER, // 5 min
            enabled: this.enabled,
            onExpire: () => {
                this.step = 1;
                this.qrInfo = {};
                this.qrWalletAddress = "";
                this.selectedCrypto = {};
                this.close();
                console.log("Expired!");
            },
        });
    }
    get equivalentCrypto() {
        return Number((this.exchange.rate ?? 0) * (this.amount ?? 0))?.toFixed(4);
    }
    updated(changed) {
        if (changed.has("selectedCrypto")) {
            this.exchange.currency = this.selectedCrypto?.token?.symbol;
        }
        if (changed.has("paymentToken") && this.paymentToken && this.step == 1) {
            this.tokenList = new UseApi(this, `/transaction/allowed-tokens/`, {
                params: {
                    token: this.paymentToken,
                },
                enabled: true,
            });
        }
        if (changed.has("qrWalletAddress")) {
            this.transaction.setAddress(this.qrWalletAddress);
        }
    }
    willUpdate(_changedProperties) {
        if (_changedProperties.has("step") && this.step == 2) {
            this.qrInfo = new UseApi(this, `/transaction/generateqr`, {
                requestInit: {
                    method: "POST",
                    body: JSON.stringify({
                        amountInUsd: String(this.amount),
                        amountNative: this.equivalentCrypto,
                        paymentToken: this.paymentToken,
                        token_id: this.selectedCrypto?.token_id,
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    },
                },
                enabled: true,
            });
        }
        if (_changedProperties.has("isDialogOpen") &&
            this.step == 1 &&
            this.isDialogOpen) {
            this.expire.restart(Date.now() + 1000 * 60 * TIMER);
        }
    }
    /* ======================
       PUBLIC METHODS
    ====================== */
    open() {
        this.step = 1;
        this.dialog.showModal();
        this.isDialogOpen = true;
    }
    close() {
        this.dialog.close();
        this.isDialogOpen = false;
    }
    /* ======================
       STEP LOGIC
    ====================== */
    goToPayment() {
        if (!this.amount || this.amount <= 0)
            return;
        this.step = 2;
    }
    markSuccess() {
        this.step = 3;
        this.dispatchEvent(new CustomEvent("payment-success", {
            detail: {
                crypto: this.selectedCrypto,
                amount: this.amount,
            },
            bubbles: true,
            composed: true,
        }));
    }
    markFailed() {
        this.step = 4;
        this.dispatchEvent(new CustomEvent("payment-failed", {
            bubbles: true,
            composed: true,
        }));
    }
    handleAmountChange(e) {
        const value = e.target.value;
        const numeric = Number(value);
        if (!isNaN(numeric)) {
            this.amount = numeric;
        }
    }
    /* ======================
       STEP 1 (UPDATED UI)
    ====================== */
    renderStep1() {
        return html `
      <div class="step1">
        <div class="left">
          <div class="amount-label">Amount to be paid</div>

          <div class="amount-row">
            <input
              disabled
              type="number"
              class="amount-input"
              .value=${String(this.amount)}
              @input=${this.handleAmountChange}
              min="0"
            />
            <div class="currency">USD</div>
          </div>

          <div class="crypto-list">
            ${this.tokenList.loading
            ? html `<div>Loading tokens...</div>`
            : this.tokenList?.data?.data?.map((c) => html `
                    <div
                      class="crypto-item ${this.selectedCrypto?.token_id ===
                c?.token_id
                ? "selected"
                : ""}"
                      @click=${() => (this.selectedCrypto = c)}
                    >
                      <img src=${c?.token?.logo_url} class="crypto-logos" />
                      ${c?.token?.symbol}
                    </div>
                  `)}
          </div>
        </div>

        <!-- RIGHT SIDE -->
        <div class="right">
          <div class="preview-title">Payment Preview</div>

          <div class="preview-row">
            <span>Total</span>
            <span>${this.amount} USD</span>
          </div>

          <div class="preview-row">
            <span>Crypto</span>
            <span>
              ${this.exchange.loading
            ? html `Loading rate...`
            : html `
                    ${this.selectedCrypto?.token?.symbol
                ? this.equivalentCrypto
                : 0}
                    ${this.selectedCrypto?.token?.symbol}
                  `}
            </span>
          </div>

          <div class="preview-amount">
            ${this.exchange.loading
            ? html `Calculating...`
            : html `
                  ${this.selectedCrypto?.token?.symbol
                ? this.equivalentCrypto
                : 0}
                  ${this.selectedCrypto?.token?.symbol}
                `}
          </div>

          <button
            class="continue-btn"
            ?disabled=${this.exchange.loading ||
            this.tokenList.loading ||
            !this.selectedCrypto?.token?.symbol ||
            Number(this.equivalentCrypto) == 0}
            @click=${this.goToPayment}
          >
            ${this.exchange.loading ? "Loading..." : "Continue →"}
          </button>
        </div>
      </div>
    `;
    }
    /* ======================
       OTHER STEPS (UNCHANGED)
    ====================== */
    renderStep2() {
        this.qrWalletAddress = this.qrInfo?.data?.data?.payQr?.qr_address;
        if (this.transaction?.data?.data?.tx_status == "paid") {
            this.step = 3;
        }
        if (this.qrInfo.loading) {
            return html `
        <div
          class="payment-container"
          style="display:flex;justify-content:center;align-items:center;min-height:420px;flex-direction:column"
        >
          <app-loader></app-loader>
          <p>Getting Qr Data...</p>
        </div>
      `;
        }
        // console.log(this.qrInfo?.error?.message, "asdasda");
        if (this.qrInfo?.isError) {
            return html `
        <div
          class="payment-container"
          style="display:flex;justify-content:center;align-items:center;min-height:420px;flex-direction:column"
        >
          <p class="error-text">
            ${this.qrInfo?.error?.message || "Something went wrong."}
          </p>
        </div>
      `;
        }
        return html `
      <div class="payment-container">
        <h2 class="payment-title">
          Pay with ${this.selectedCrypto?.token?.symbol}
        </h2>

        <div class="amount-card">
          <div class="amount-row">
            <span>You Pay</span>
            <strong>${this.amount} USD</strong>
          </div>

          <div class="amount-divider">↓ Conversion ↓</div>

          <div class="amount-row crypto">
            <span>Send</span>
            <strong>
              ${this.exchange.loading
            ? "Calculating..."
            : `${this.equivalentCrypto} ${this.selectedCrypto?.token?.symbol}`}
            </strong>
          </div>
        </div>

        <div class="qr-container">
          <img src=${this.qrInfo?.data?.data?.paymentQr} class="qr-image" />
        </div>

        <div class="wallet-box">
          <div>
            <div class="wallet-label">Wallet Address</div>
            <div class="wallet-address">
              ${this.qrInfo?.data?.data?.payQr?.qr_address}
            </div>
          </div>
          <div>
            ${this.transaction?.loading &&
            html `<wifi-loader .text=${""}></wifi-loader>`}
          </div>
        </div>

        <!-- <div class="actions">
          <button class="secondary" @click=${this.markFailed}>Reject</button>
          <button class="primary" @click=${this.markSuccess}>I've Paid</button>
        </div> -->
      </div>
    `;
    }
    renderStep3() {
        return html `
      <div class="result-container">
        <div class="result-card success-card">
          <div class="result-icon">✓</div>

          <div class="result-title">Payment Successful</div>

          <div class="result-subtitle">
            Your transaction has been completed successfully.
          </div>

          <div class="result-summary">
            <div class="summary-row">
              <span>Paid</span>
              <strong>${this.amount} USD</strong>
            </div>

            <div class="summary-row highlight">
              <span>Crypto Sent</span>
              <strong>
                ${this.equivalentCrypto} ${this.selectedCrypto?.token?.symbol}
              </strong>
            </div>
          </div>

          <button class="primary result-btn" @click=${this.close}>Close</button>
        </div>
      </div>
    `;
    }
    renderStep4() {
        return html `
      <div class="result-container">
        <div class="result-card failed-card">
          <div class="result-icon failed-icon">✕</div>

          <div class="result-title failed-title">Payment Rejected</div>

          <div class="result-subtitle">
            The transaction was not completed. Please try again.
          </div>

          <div class="result-summary">
            <div class="summary-row">
              <span>Attempted</span>
              <strong>${this.amount} USD</strong>
            </div>

            <div class="summary-row highlight-failed">
              <span>Crypto</span>
              <strong>
                ${this.equivalentCrypto} ${this.selectedCrypto?.token?.symbol}
              </strong>
            </div>
          </div>

          <button class="primary result-btn failed-btn" @click=${this.close}>
            Close
          </button>
        </div>
      </div>
    `;
    }
    render() {
        return html `
      <dialog @cancel=${this.close}>
        ${this.step === 1
            ? this.renderStep1()
            : this.step === 2
                ? this.renderStep2()
                : this.step === 3
                    ? this.renderStep3()
                    : this.renderStep4()}
        <close-button @click=${this.close}></close-button>
        ${this.step < 3
            ? html `<div class="timeRemainContainer">
              <p>Time Left:</p>
              <p>
                ${this.expire.hours}h : ${this.expire.minutes}m :
                ${this.expire.seconds}s
              </p>
            </div>`
            : html ``}
      </dialog>
    `;
    }
};
CryptoPay.styles = cryptoPayStyles;
__decorate([
    state()
], CryptoPay.prototype, "step", void 0);
__decorate([
    property({ type: String })
], CryptoPay.prototype, "paymentToken", void 0);
__decorate([
    state()
], CryptoPay.prototype, "selectedCrypto", void 0);
__decorate([
    property({ type: Number })
], CryptoPay.prototype, "amount", void 0);
__decorate([
    state()
], CryptoPay.prototype, "qrInfo", void 0);
__decorate([
    state()
], CryptoPay.prototype, "enabled", void 0);
__decorate([
    query("dialog")
], CryptoPay.prototype, "dialog", void 0);
__decorate([
    state()
], CryptoPay.prototype, "isDialogOpen", void 0);
__decorate([
    state()
], CryptoPay.prototype, "qrWalletAddress", void 0);
CryptoPay = __decorate([
    customElement("crypto-pay")
], CryptoPay);
export { CryptoPay };
//# sourceMappingURL=index.js.map