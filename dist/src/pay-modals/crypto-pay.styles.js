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
  .timeRemainContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* width: 100%; */
    background: linear-gradient(135deg, #4f7cff, #3b6df0);
    padding: 0px 20px;
    color: #fff;
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
`;
//# sourceMappingURL=crypto-pay.styles.js.map