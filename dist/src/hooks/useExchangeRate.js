export class UseExchangeRate {
    constructor(host, currency) {
        this.rate = 0;
        this.loading = false;
        this.error = null;
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
    set currency(value) {
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
        if (!this._currency)
            return;
        this.abortController?.abort();
        this.abortController = new AbortController();
        this.loading = true;
        this.error = null;
        this.host.requestUpdate();
        try {
            const res = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${this._currency}&tsyms=USD`, { signal: this.abortController.signal });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const data = await res.json();
            this.rate = data?.USD ?? 0;
        }
        catch (err) {
            if (err?.name !== "AbortError") {
                this.error = err;
                this.rate = 0;
            }
        }
        finally {
            this.loading = false;
            this.host.requestUpdate();
        }
    }
    refetch() {
        this.fetchRate();
    }
}
//# sourceMappingURL=useExchangeRate.js.map