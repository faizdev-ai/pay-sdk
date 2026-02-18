import { ReactiveControllerHost } from "lit";
import { TaskStatus } from "@lit/task";
export declare const baseUrl = "http://192.168.89.171:5050/api";
interface UseApiOptions {
    enabled?: boolean;
    requestInit?: RequestInit;
    deps?: unknown[];
    params?: Record<string, string | number | boolean | undefined>;
}
export declare class UseApi<T> {
    private host;
    private url;
    private enabled;
    private requestInit?;
    private deps;
    private params?;
    private task;
    constructor(host: ReactiveControllerHost, url: string, options?: UseApiOptions);
    get data(): T | undefined;
    get loading(): boolean;
    get error(): unknown;
    get status(): TaskStatus;
    get isInitial(): boolean;
    get isSuccess(): boolean;
    get isError(): boolean;
    refetch(): void;
    setEnabled(value: boolean): void;
    setUrl(newUrl: string): void;
    setRequestInit(requestInit?: RequestInit): void;
    setDependencies(deps: unknown[]): void;
    setParams(params?: Record<string, string | number | boolean | undefined>): void;
}
export {};
//# sourceMappingURL=use-api.d.ts.map