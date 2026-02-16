import { ReactiveController, ReactiveControllerHost } from "lit";

interface ExchangeRateResponse {
  USD: number; // 1 CRYPTO = X USD
}

export class UseExchangeRate implements ReactiveController {
  private host: ReactiveControllerHost;
  private _currency: string;
  private abortController?: AbortController;

  rate: number = 0;
  loading: boolean = false;
  error: unknown = null;

  constructor(host: ReactiveControllerHost, currency: string) {
    this.host = host;
    this._currency = currency;

    host.addController(this);
  }

  /* ==============================
     Lifecycle
  ============================== */

  hostConnected() {
    if (this._currency) {
      this.fetchRate();
    }
  }

  hostDisconnected() {
    this.abortController?.abort();
  }

  /* ==============================
     Symbol Setter
  ============================== */

  set currency(value: string) {
    if (this._currency !== value) {
      this._currency = value;
      this.fetchRate();
    }
  }

  get currency() {
    return this._currency;
  }

  get isSuccess() {
    return !!this.rate && !this.loading && !this.error;
  }

  /* ==============================
     Fetch Rate
  ============================== */

  async fetchRate() {
    if (!this._currency) return;

    this.abortController?.abort();
    this.abortController = new AbortController();

    this.loading = true;
    this.error = null;
    this.host.requestUpdate();

    try {
      const res = await fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${this._currency}&tsyms=USD`,
        { signal: this.abortController.signal },
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: ExchangeRateResponse = await res.json();
      this.rate = data?.USD ?? 0;
    } catch (err) {
      if ((err as any)?.name !== "AbortError") {
        this.error = err;
        this.rate = 0;
      }
    } finally {
      this.loading = false;
      this.host.requestUpdate();
    }
  }

  refetch() {
    this.fetchRate();
  }
}
