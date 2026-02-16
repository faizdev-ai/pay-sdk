export class UseExpire {
    constructor(host, options) {
        this.expireAt = 0;
        this.enabled = false;
        this.days = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.expired = false;
        this.host = host;
        host.addController(this);
        this.setOptions(options);
    }
    // 🔁 Update configuration dynamically
    setOptions(options) {
        this.expireAt =
            options.expireTime instanceof Date
                ? options.expireTime.getTime()
                : options.expireTime;
        this.enabled = !!options.enabled;
        this.onExpire = options.onExpire;
        if (this.enabled) {
            this.start();
        }
        else {
            this.stop();
        }
    }
    // 🚀 Start timer
    start() {
        this.stop();
        this.expired = false;
        this.tick();
        this.intervalId = window.setInterval(() => {
            this.tick();
        }, 1000);
    }
    // 🛑 Stop timer
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }
    // 🔁 NEW: Restart timer
    restart(newExpireTime) {
        if (newExpireTime) {
            this.expireAt =
                newExpireTime instanceof Date ? newExpireTime.getTime() : newExpireTime;
        }
        this.expired = false;
        if (this.enabled) {
            this.start();
        }
        this.host.requestUpdate();
    }
    // ⏳ Countdown logic
    tick() {
        const now = Date.now();
        const diff = this.expireAt - now;
        if (diff <= 0) {
            this.days = this.hours = this.minutes = this.seconds = 0;
            this.expired = true;
            this.stop();
            if (this.onExpire) {
                this.onExpire();
            }
            this.host.requestUpdate();
            return;
        }
        this.expired = false;
        const totalSeconds = Math.floor(diff / 1000);
        this.days = Math.floor(totalSeconds / (24 * 60 * 60));
        this.hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
        this.minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        this.seconds = totalSeconds % 60;
        this.host.requestUpdate();
    }
    hostDisconnected() {
        this.stop();
    }
}
//# sourceMappingURL=use-expire.js.map