import { ReactiveController, ReactiveControllerHost } from "lit";
import { UseApi } from "./use-api.js";

type TransactionResponse = any;
export class UseGetTransactionById implements ReactiveController {
  private host: ReactiveControllerHost;
  private intervalId?: number;
  private loadingState?: boolean;

  private api: UseApi<TransactionResponse>;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);

    // 🔥 Start disabled and empty URL
    this.api = new UseApi<TransactionResponse>(host, "", {
      enabled: false,
    });
  }

  /* =========================
     Public Getters
  ========================== */

  get data() {
    return this.api.data;
  }

  get loading() {
    // return this.api.loading;
    return this.loadingState;
  }

  get error() {
    return this.api.error;
  }

  get status() {
    return this.api.status;
  }

  /* =========================
     Address Setter
  ========================== */

  setAddress(address?: string) {
    if (!address) {
      this.api.setEnabled(false);
      this.stopPolling();
      return;
    }

    // ✅ Update URL dynamically (THIS was missing)
    this.api.setUrl(`/transaction/getTransactionByPaymentToken/${address}/`);

    this.api.setEnabled(true);

    this.startPolling();
  }

  /* =========================
     Polling
  ========================== */

  private startPolling() {
    this.stopPolling();
    this.loadingState = true;
    this.intervalId = window.setInterval(() => {
      // console.log(this.api, "asdadsa");

      if (this.api.data?.tx_status == "paid") {
        this.loadingState = false;
        this.stopPolling();
        return;
      }

      this.api.refetch();
    }, 10000);
  }

  private stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  hostDisconnected() {
    this.stopPolling();
  }
}
