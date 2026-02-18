import { ReactiveController, ReactiveControllerHost } from "lit";
export declare class UseExchangeRate implements ReactiveController {
    private host;
    private _currency;
    private abortController?;
    rate: number;
    loading: boolean;
    error: unknown;
    constructor(host: ReactiveControllerHost, currency: string);
    hostConnected(): void;
    hostDisconnected(): void;
    set currency(value: string);
    get currency(): string;
    get isSuccess(): boolean;
    fetchRate(): Promise<void>;
    refetch(): void;
}
//# sourceMappingURL=useExchangeRate.d.ts.map