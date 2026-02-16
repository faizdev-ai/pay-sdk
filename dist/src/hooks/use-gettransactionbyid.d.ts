import { ReactiveController, ReactiveControllerHost } from "lit";
interface TransactionResponse {
    tx_status?: string;
}
export declare class UseGetTransactionById implements ReactiveController {
    private host;
    private intervalId?;
    private loadingState?;
    private api;
    constructor(host: ReactiveControllerHost);
    get data(): TransactionResponse | undefined;
    get loading(): boolean | undefined;
    get error(): unknown;
    get status(): import("@lit/task").TaskStatus;
    setAddress(address?: string): void;
    private startPolling;
    private stopPolling;
    hostDisconnected(): void;
}
export {};
