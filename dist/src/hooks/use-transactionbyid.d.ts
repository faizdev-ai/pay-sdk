import { ReactiveController, ReactiveControllerHost } from "lit";
interface TransactionResponse {
    tx_status: string;
    [key: string]: any;
}
export declare class UseGetTransactionById implements ReactiveController {
    private host;
    private intervalId?;
    private _address?;
    private api;
    constructor(host: ReactiveControllerHost, address?: string);
    hostDisconnected(): void;
    set address(value: string | undefined);
    private startPolling;
    private stopPolling;
    get data(): TransactionResponse | undefined;
    get loading(): boolean;
    get error(): unknown;
    get status(): import("@lit/task").TaskStatus;
    refetch(): void;
}
export {};
