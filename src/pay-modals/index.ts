import { LitElement, html, css, PropertyValues } from "lit";
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
const TIMER = 10;

@customElement("crypto-pay")
export class CryptoPay extends LitElement {
  static styles = cryptoPayStyles;
  @state() private step = 1;
  @property({ type: String })
  paymentToken = "";
  @state() private selectedCrypto: any = {};
  // @state() private amount = 10;
  @property({ type: Number }) amount = 0;
  @state() private qrInfo: any = {};
  @state() enabled = true;
  @query("dialog") private dialog!: HTMLDialogElement;
  @state() private isDialogOpen = false;
  @state() private qrWalletAddress = "";
  private transaction = new UseGetTransactionById(this);

  private tokenList = new UseApi<any>(this, `/transaction/allowed-tokens/`, {
    requestInit: {},
    params: {
      token: this.paymentToken,
    },
    enabled: !!this.paymentToken,
    deps: [this.paymentToken],
  });
  private exchange = new UseExchangeRate(this, "BTC");
  get equivalentCrypto() {
    return Number((this.exchange.rate ?? 0) * (this.amount ?? 0))?.toFixed(4);
  }
  private expire = new UseExpire(this, {
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

  updated(changed: Map<string, unknown>) {
    if (changed.has("selectedCrypto")) {
      this.exchange.currency = this.selectedCrypto?.token?.symbol;
    }
    if (changed.has("paymentToken") && this.paymentToken && this.step == 1) {
      this.tokenList = new UseApi<any>(this, `/transaction/allowed-tokens/`, {
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

  protected willUpdate(_changedProperties: PropertyValues): void {
    if (_changedProperties.has("step") && this.step == 2) {
      this.qrInfo = new UseApi<any>(this, `/transaction/generateqr`, {
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
    if (
      _changedProperties.has("isDialogOpen") &&
      this.step == 1 &&
      this.isDialogOpen
    ) {
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
  }

  /* ======================
     STEP LOGIC
  ====================== */

  private goToPayment() {
    if (!this.amount || this.amount <= 0) return;
    this.step = 2;
  }

  private markSuccess() {
    this.step = 3;

    this.dispatchEvent(
      new CustomEvent("payment-success", {
        detail: {
          success: true,
          trxnData: this.transaction?.data?.data,
          crypto: this.selectedCrypto,
          amount: this.amount,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private markFailed() {
    this.step = 4;
    this.dispatchEvent(
      new CustomEvent("payment-failed", {
        detail: {
          success: false,
          trxnData: this.transaction?.data?.data,
          crypto: this.selectedCrypto,
          amount: this.amount,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleAmountChange(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    const numeric = Number(value);
    if (!isNaN(numeric)) {
      this.amount = numeric;
    }
  }

  /* ======================
     STEP 1 (UPDATED UI)
  ====================== */

  private renderStep1() {
    return html`
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
              ? html`<div>Loading tokens...</div>`
              : this.tokenList?.data?.data?.map(
                  (c: any) => html`
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
                  `,
                )}
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
                ? html`Loading rate...`
                : html`
                    ${this.selectedCrypto?.token?.symbol
                      ? this.equivalentCrypto
                      : 0}
                    ${this.selectedCrypto?.token?.symbol}
                  `}
            </span>
          </div>

          <div class="preview-amount">
            ${this.exchange.loading
              ? html`Calculating...`
              : html`
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

  private renderStep2() {
    this.qrWalletAddress = this.qrInfo?.data?.data?.payQr?.qr_address;
    if (this.transaction?.data?.data?.tx_status == "paid") {
      this.markSuccess();
    }
    if (this.qrInfo.loading) {
      return html`
        <div
          class="payment-sdk-container"
          style="display:flex;justify-content:center;align-items:center;min-height:420px;flex-direction:column"
        >
          <app-loader></app-loader>
          <p>Getting Qr Data...</p>
        </div>
      `;
    }
    // console.log(this.qrInfo?.error?.message, "asdasda");

    if (this.qrInfo?.isError) {
      return html`
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
    return html`
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

    // return html`
    //   <div class="payment-sdk-container">
    //     <h2 class="payment-title">
    //       Pay with ${this.selectedCrypto?.token?.symbol}
    //     </h2>

    //     <div class="amount-card">
    //       <div class="amount-row">
    //         <span>You Pay</span>
    //         <strong>${this.amount} USD</strong>
    //       </div>

    //       <div class="amount-divider">↓ Conversion ↓</div>

    //       <div class="amount-row crypto">
    //         <span>Send</span>
    //         <strong>
    //           ${this.exchange.loading
    //             ? "Calculating..."
    //             : `${this.equivalentCrypto} ${this.selectedCrypto?.token?.symbol}`}
    //         </strong>
    //       </div>
    //     </div>

    //     <div class="qr-container">
    //       <img src=${this.qrInfo?.data?.data?.paymentQr} class="qr-image" />
    //     </div>

    //     <div class="wallet-box">
    //       <div>
    //         <div class="wallet-label">Wallet Address</div>
    //         <div class="wallet-address">
    //           ${this.qrInfo?.data?.data?.payQr?.qr_address}
    //         </div>
    //       </div>
    //       <div>
    //         ${this.transaction?.loading &&
    //         html`<wifi-loader .text=${""}></wifi-loader>`}
    //       </div>
    //     </div>

    //     <!-- <div class="actions">
    //       <button class="secondary" @click=${this.markFailed}>Reject</button>
    //       <button class="primary" @click=${this.markSuccess}>I've Paid</button>
    //     </div> -->
    //   </div>
    // `;
  }
  private renderStep3() {
    return html`
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

  private renderStep4() {
    return html`
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
    return html`
      <dialog @cancel=${this.close}>
        <div class="main-payment-sdk-container">
          <div class="main-payment-form-container">
            ${this.step === 1
              ? this.renderStep1()
              : this.step === 2
                ? this.renderStep2()
                : this.step === 3
                  ? this.renderStep3()
                  : this.renderStep4()}
            <close-button @click=${this.close}></close-button>
          </div>
          <div class="main-payment-timer-container">
            ${this.step < 3
              ? html`<div class="timeRemainContainer">
                  <p>Expiration Time:</p>
                  <p>
                    ${this.expire.hours}h : ${this.expire.minutes}m :
                    ${this.expire.seconds}s
                  </p>
                </div>`
              : html``}
          </div>
        </div>
      </dialog>
    `;
  }
}
