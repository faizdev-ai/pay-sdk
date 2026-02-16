import { UseApi } from "./use-api.js";
export class UseGetTransactionById {
    constructor(host, address) {
        this.host = host;
        host.addController(this);
        this._address = address;
        this.api = new UseApi(this.host, "orders/getTransactionByPaymentToken", {
            enabled: !!address,
            params: { address },
        });
    }
    /* -------------------------
       Lifecycle
    -------------------------- */
    hostDisconnected() {
        this.stopPolling();
    }
    /* -------------------------
       Address Setter
    -------------------------- */
    set address(value) {
        if (this._address === value)
            return;
        this._address = value;
        console.log(value, "value>>");
        this.api.setParams({ address: value });
        this.api.setEnabled(!!value);
        this.stopPolling();
        if (value) {
            this.startPolling();
        }
    }
    /* -------------------------
       Polling Logic
    -------------------------- */
    startPolling() {
        this.stopPolling();
        this.intervalId = window.setInterval(() => {
            if (this.api.data?.tx_status === "paid") {
                this.stopPolling();
                return;
            }
            this.api.refetch();
        }, 10000);
    }
    stopPolling() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }
    /* -------------------------
       Expose API State
    -------------------------- */
    get data() {
        return this.api.data;
    }
    get loading() {
        return this.api.loading;
    }
    get error() {
        return this.api.error;
    }
    get status() {
        return this.api.status;
    }
    refetch() {
        this.api.refetch();
    }
}
//# sourceMappingURL=use-transactionbyid.js.map