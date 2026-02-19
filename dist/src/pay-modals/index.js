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
import { shortenAddress } from "../utils/shortenAddress.js";
import { copyToClipBoard } from "../utils/copyToClipBoard.js";
import { keyed } from "lit/directives/keyed.js";
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
        this.step = 1;
        this.qrInfo = {};
        this.qrWalletAddress = "";
        this.selectedCrypto = {};
        this.transaction = new UseGetTransactionById(this);
        this.dialog.close();
        this.isDialogOpen = false;
        this.dispatchEvent(new CustomEvent("onClose", {
            bubbles: true,
            composed: true,
        }));
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
                success: true,
                trxnData: this.transaction?.data?.data,
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
            detail: {
                success: false,
                trxnData: this.transaction?.data?.data,
                crypto: this.selectedCrypto,
                amount: this.amount,
            },
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
            <div class="currency currencyStep1">USD</div>
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
            this.markSuccess();
        }
        if (this.qrInfo.loading) {
            return html `
        <div
          class="payment-sdk-container"
          style="display:flex;justify-content:center;align-items:center;min-height:420px;flex-direction:column"
        >
          <app-loader></app-loader>
          <p>Generating Wallets...</p>
        </div>
      `;
        }
        // console.log(this.qrInfo?.error?.message, "asdasda");
        if (this.qrInfo?.isError) {
            return html `
        <div
          class="payment-sdk-container"
          style="display:flex;justify-content:center;align-items:center;min-height:420px;flex-direction:column"
        >
          <p class="error-text">
            ${this.qrInfo?.error?.message || "Something went wrong."}
          </p>
        </div>
      `;
        }
        return html `
      <div class="steptwoContainer">
        <p class="step2HeaderTitle">
          ${this.exchange.loading
            ? "Calculating..."
            : `${this.equivalentCrypto} ${this.selectedCrypto?.token?.symbol}`}
        </p>
        <p class="step2HeaderSubTitle">${this.amount} USD</p>
        <p class="step2HeaderSubTitle">
          Network .${this.selectedCrypto?.token?.chain?.name}
        </p>
        <div class="conditionContainer">
          <p class="step2HeaderSubTitle text-muted">You Pay network fees</p>
          <p class="step2HeaderSubTitle">Info</p>
        </div>
        <div class="step2TrxnContainer">
          <img
            src=${this.qrInfo?.data?.data?.paymentQr}
            class="step2-qr-image"
          />
          <div class="step2TrxnContainer-right-box">
            <p class="text-muted step2TrxnContainer-right-box-title">
              Recipient's wallet address
            </p>
            <p class="step2TrxnContainer-right-box-subtitle">
              Recipient's wallet address
            </p>
            <p class="text-muted step2TrxnContainer-right-box-tirtiarytitle">
              When your payment status will change, we'll send to you
              notification.
            </p>
          </div>
        </div>
        <div class="step2TrxnContainer step2TrxnContainerContractAddress">
          <p>Recipient's wallet address:</p>
          <p
            class="contractAddress"
            @click=${() => {
            copyToClipBoard(this.qrInfo?.data?.data?.payQr?.qr_address);
        }}
          >
            ${shortenAddress(this.qrInfo?.data?.data?.payQr?.qr_address)}
          </p>
        </div>
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
        // console.log(this, "keyed>>>");
        return html `
      <dialog @cancel=${this.close}>
        <app-toaster></app-toaster>
        <div class="main-payment-sdk-container">
          <div class="main-payment-form-container">
            ${keyed(this.step, html `
                <div class="step-transition">
                  ${this.step === 1
            ? this.renderStep1()
            : this.step === 2
                ? this.renderStep2()
                : this.step === 3
                    ? this.renderStep3()
                    : this.renderStep4()}
                </div>
              `)}
            <close-button @click=${this.close}></close-button>
          </div>
          <div class="main-payment-timer-container">
            ${this.step < 3
            ? html `<div class="timeRemainContainer">
                  <p>Expiration Time:</p>
                  <p>
                    ${this.expire.hours}h : ${this.expire.minutes}m :
                    ${this.expire.seconds}s
                  </p>
                </div>`
            : html ``}
          </div>
        </div>
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