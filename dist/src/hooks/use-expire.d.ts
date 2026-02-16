import { ReactiveController, ReactiveControllerHost } from "lit";
export interface ExpireOptions {
    expireTime: number | Date;
    enabled?: boolean;
    onExpire?: () => void;
}
export declare class UseExpire implements ReactiveController {
    private host;
    private intervalId?;
    private expireAt;
    private enabled;
    private onExpire?;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
    constructor(host: ReactiveControllerHost, options: ExpireOptions);
    setOptions(options: ExpireOptions): void;
    private start;
    private stop;
    restart(newExpireTime?: number | Date): void;
    private tick;
    hostDisconnected(): void;
}
