import { css } from "lit";
export const cryptoPayStyles = css `
  :host {
    all: initial;
    display: inline-block;
    font-family: sans-serif;
  }

  .error-text {
    color: red;
    font-size: 1.5em;
    font-weight: 500;
  }

  dialog {
    border: none;
    border-radius: 18px;
    padding: 0;
    width: 720px;
    max-width: 95vw;
    overflow: hidden;
    font-family: system-ui, sans-serif;
    position: relative;
    background-color: #ffffff;
  }

  .main-payment-sdk-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    height: 100%;
  }
  .main-payment-form-container {
    height: 100%;
  }
  .main-payment-timer-container {
    flex: 1;
  }

  .timeRemainContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* width: 100%; */
    background: linear-gradient(135deg, #4f7cff, #3b6df0);
    padding: 0px 20px;
    color: #fff;
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
  }

  /* =========================
     Step 1 Layout
  ========================== */

  .step1 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 420px;
    overflow: auto;
  }

  .left {
    background: linear-gradient(135deg, #4f7cff, #3b6df0);
    padding: 28px;
    color: white;
    display: flex;
    flex-direction: column;
  }

  .right {
    background: #f8fafc;
    padding: 28px;
    color: #0f172a;
  }

  .amount-label {
    font-size: 14px;
    opacity: 0.9;
  }

  .amount-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    padding-bottom: 8px;
    color: #111;
  }

  .amount-input {
    font-size: 36px;
    font-weight: 700;
    border: none;
    background: transparent;
    color: white;
    width: 120px;
    outline: none;
  }

  .amount-input::-webkit-outer-spin-button,
  .amount-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .currency {
    margin-left: auto;
    font-weight: 600;
    font-size: 18px;
  }
  .currencyStep1 {
    color: #fff;
  }

  .crypto-list {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
    max-height: 400px;
  }

  .crypto-logos {
    height: 24px;
    width: 24px;
    object-fit: contain;
  }

  .crypto-item {
    background: rgba(255, 255, 255, 0.15);
    padding: 14px;
    border-radius: 12px;
    cursor: pointer;
    border: 2px solid transparent;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .crypto-item:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  .crypto-item.selected {
    border-color: #ffffff;
    background: rgba(255, 255, 255, 0.35);
  }

  /* =========================
     Preview
  ========================== */

  .preview-title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 20px;
  }

  .preview-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
  }

  .preview-amount {
    margin-top: 24px;
    background: #e2e8f0;
    padding: 18px;
    border-radius: 14px;
    text-align: center;
    font-size: 28px;
    font-weight: 700;
  }

  .continue-btn {
    margin-top: 24px;
    width: 100%;
    padding: 14px;
    border-radius: 14px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    background: linear-gradient(90deg, #4f7cff, #f97316);
    color: white;
    font-size: 16px;
    transition: opacity 0.2s ease;
  }

  .continue-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* =========================
     Payment Step (Step 2)
  ========================== */

  .payment-sdk-container {
    padding: 40px 30px;
    text-align: center;
    background-color: #ffffff;
  }

  .payment-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 24px;
    color: #111;
  }

  .amount-card {
    /* background: #f1f5f9; */
    padding: 20px;
    border-radius: 16px;
    margin-bottom: 24px;
  }

  .amount-divider {
    font-size: 12px;
    opacity: 0.6;
    margin: 10px 0;
  }

  .qr-container {
    background: white;
    padding: 16px;
    border-radius: 16px;
    width: fit-content;
    margin: 0 auto 20px auto;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  }

  .qr-image {
    height: 200px;
    width: 200px;
  }

  .wallet-box {
    background: #0f172a;
    color: white;
    padding: 14px;
    border-radius: 12px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
  }

  .wallet-label {
    font-size: 12px;
    opacity: 0.7;
    margin-bottom: 6px;
    text-align: left;
  }

  .wallet-address {
    font-size: 13px;
    word-break: break-all;
  }

  .actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }

  button {
    flex: 1;
    padding: 12px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-weight: 600;
  }

  button.primary {
    background: #22c55e;
    color: white;
  }

  button.secondary {
    background: #ef4444;
    color: white;
  }

  /* =========================
     Result Screens
  ========================== */

  .result-container {
    padding: 50px 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .result-card {
    width: 100%;
    max-width: 420px;
    background: white;
    padding: 30px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  }

  .result-icon {
    height: 70px;
    width: 70px;
    margin: 0 auto 20px auto;
    color: white;
    font-size: 32px;
    font-weight: bold;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .success-card {
    border: 2px solid #22c55e20;
  }

  .result-icon {
    background: #22c55e;
  }

  .result-title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .result-subtitle {
    font-size: 14px;
    opacity: 0.6;
    margin-bottom: 24px;
  }

  .result-summary {
    background: #f8fafc;
    padding: 18px;
    border-radius: 14px;
    margin-bottom: 24px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 8px;
  }

  .summary-row.highlight {
    font-size: 16px;
    color: #16a34a;
    font-weight: 600;
  }

  .failed-card {
    border: 2px solid #ef444420;
  }

  .failed-icon {
    background: #ef4444;
  }

  .failed-title {
    color: #dc2626;
  }

  .highlight-failed {
    font-size: 16px;
    color: #dc2626;
    font-weight: 600;
  }

  .result-btn {
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    font-weight: 600;
  }

  /* =========================
     Responsive
  ========================== */

  @media (max-width: 768px) {
    .payment-sdk-container {
      /* height: 80px; */
      overflow: auto;
      background-color: #ffffff;
    }
    dialog {
      width: 100%;
      max-width: 100vw;
      height: 100vh;
      border-radius: 0;
      overflow: auto;
      background-color: #ffffff;
    }

    .step1 {
      grid-template-columns: 1fr;
      height: 100vh;
    }

    .left,
    .right {
      padding: 20px;
    }
    .right {
      height: 300px;
    }

    .crypto-list {
      max-height: 250px;
    }

    .preview-amount {
      font-size: 22px;
    }

    .qr-image {
      height: 160px;
      width: 160px;
    }

    .actions {
      flex-direction: column;
    }

    button {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .amount-input {
      font-size: 28px;
      width: 100px;
    }

    .payment-title {
      font-size: 20px;
    }
  }
  .steptwoContainer {
    background-color: #f4f5f7;
    padding: 24px;
    margin: 0px 15px;
    border-radius: 16px;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
    max-width: 480px;
    margin: 68px auto;
  }

  /* ===== Header ===== */

  .step2HeaderTitle {
    background: linear-gradient(90deg, #111, #444);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 28px;
    font-weight: 700;
    margin: 0;
  }

  .step2HeaderSubTitle {
    font-size: 14px;
    font-weight: 500;
    margin: 6px 0 0 0;
  }

  .conditionContainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }

  .text-muted {
    color: #7a7a7a;
    font-weight: 400;
  }

  /* ===== QR + Wallet Card ===== */

  .step2TrxnContainer {
    background-color: #ffffff;
    display: flex;
    padding: 20px;
    gap: 16px;
    margin-top: 20px;
    border-radius: 16px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
    align-items: center;
  }

  .step2-qr-image {
    height: 120px;
    width: 120px;
    border-radius: 12px;
    border: 1px solid #eee;
    padding: 8px;
    background: #fafafa;
  }

  .step2TrxnContainer-right-box {
    flex: 1;
  }

  .step2TrxnContainer-right-box-title {
    font-size: 12px;
    color: #8a8a8a;
    margin: 0;
  }

  .step2TrxnContainer-right-box-subtitle {
    font-size: 15px;
    font-weight: 600;
    margin: 6px 0;
    word-break: break-all;
  }

  .step2TrxnContainer-right-box-tirtiarytitle {
    font-size: 12px;
    color: #6f6f6f;
    margin: 0;
    line-height: 1.4;
  }
  .contractAddress {
    text-decoration: underline;
    cursor: pointer;
  }
  @media (max-width: 768px) {
    .steptwoContainer {
      padding: 20px;
    }

    .step2HeaderTitle {
      font-size: 24px;
    }

    .step2TrxnContainer {
      padding: 18px;
    }

    .step2-qr-image {
      height: 100px;
      width: 100px;
    }
  }
  .step2TrxnContainerContractAddress {
    padding: 10px;
    gap: 4px;
    line-height: 6px;
  }

  /* Mobile */
  @media (max-width: 480px) {
    .steptwoContainer {
      padding: 16px;
      border-radius: 0; /* full width feel on mobile */
    }

    .step2HeaderTitle {
      font-size: 22px;
    }

    .step2HeaderSubTitle {
      font-size: 13px;
    }

    .conditionContainer {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }

    /* Stack QR and wallet vertically */
    .step2TrxnContainer {
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 18px;
    }

    .step2-qr-image {
      height: 160px;
      width: 160px;
    }

    .step2TrxnContainer-right-box {
      width: 100%;
    }

    .step2TrxnContainer-right-box-subtitle {
      font-size: 14px;
      word-break: break-word;
    }

    .step2TrxnContainer-right-box-tirtiarytitle {
      font-size: 12px;
    }
  }

  /* Very Small Devices */
  @media (max-width: 360px) {
    .step2HeaderTitle {
      font-size: 18px;
    }

    .step2-qr-image {
      height: 140px;
      width: 140px;
    }
  }
  .step-transition {
    animation: stepEnter 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  @keyframes stepEnter {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
//# sourceMappingURL=crypto-pay.styles.js.map