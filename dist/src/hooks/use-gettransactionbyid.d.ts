import { ReactiveController, ReactiveControllerHost } from "lit";
export declare class UseGetTransactionById implements ReactiveController {
    private host;
    private intervalId?;
    private loadingState?;
    private api;
    constructor(host: ReactiveControllerHost);
    get data(): any;
    get loading(): boolean | undefined;
    get error(): unknown;
    get status(): import("@lit/task").TaskStatus;
    setAddress(address?: string): void;
    private startPolling;
    private stopPolling;
    hostDisconnected(): void;
}
//# sourceMappingURL=use-gettransactionbyid.d.ts.map