import { ReactiveController, ReactiveControllerHost } from "lit";

export interface ExpireOptions {
  expireTime: number | Date;
  enabled?: boolean;
  onExpire?: () => void;
}

export class UseExpire implements ReactiveController {
  private host: ReactiveControllerHost;
  private intervalId?: number;
  private expireAt: number = 0;
  private enabled: boolean = false;
  private onExpire?: () => void;

  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;
  expired = false;

  constructor(host: ReactiveControllerHost, options: ExpireOptions) {
    this.host = host;
    host.addController(this);
    this.setOptions(options);
  }

  // 🔁 Update configuration dynamically
  setOptions(options: ExpireOptions) {
    this.expireAt =
      options.expireTime instanceof Date
        ? options.expireTime.getTime()
        : options.expireTime;

    this.enabled = !!options.enabled;
    this.onExpire = options.onExpire;

    if (this.enabled) {
      this.start();
    } else {
      this.stop();
    }
  }

  // 🚀 Start timer
  private start() {
    this.stop();
    this.expired = false;
    this.tick();

    this.intervalId = window.setInterval(() => {
      this.tick();
    }, 1000);
  }

  // 🛑 Stop timer
  private stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  // 🔁 NEW: Restart timer
  restart(newExpireTime?: number | Date) {
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
  private tick() {
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
