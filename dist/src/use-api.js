import { Task, TaskStatus } from "@lit/task";
export const baseUrl = "https://paymentgateway-backend.chainbull.net/api";
export class UseApi {
    constructor(host, url, options = {}) {
        this.host = host;
        this.url = url;
        this.enabled = options.enabled ?? true;
        this.requestInit = options.requestInit;
        this.deps = options.deps ?? [];
        this.params = options.params;
        this.task = new Task(this.host, {
            task: async ([url, requestInit, enabled, params], { signal }) => {
                if (!enabled) {
                    return new Promise(() => { });
                }
                // ✅ Build query string safely
                let finalUrl = `${baseUrl}${url}`;
                if (params && Object.keys(params).length > 0) {
                    const searchParams = new URLSearchParams();
                    Object.entries(params).forEach(([key, value]) => {
                        if (value !== undefined && value !== null) {
                            searchParams.append(key, String(value));
                        }
                    });
                    finalUrl += `?${searchParams.toString()}`;
                }
                const res = await fetch(finalUrl, {
                    ...requestInit,
                    signal,
                });
                if (!res.ok) {
                    throw new Error(`HTTP Error: ${res.status}`);
                }
                return res.json();
            },
            args: () => [
                this.url,
                this.requestInit,
                this.enabled,
                this.params,
                ...this.deps,
            ],
        });
    }
    /* =========================
       Reactive States
    ========================== */
    get data() {
        return this.task.status === TaskStatus.COMPLETE
            ? this.task.value
            : undefined;
    }
    get loading() {
        return this.task.status === TaskStatus.PENDING;
    }
    get error() {
        return this.task.status === TaskStatus.ERROR ? this.task.error : undefined;
    }
    get status() {
        return this.task.status;
    }
    get isInitial() {
        return this.task.status === TaskStatus.INITIAL;
    }
    get isSuccess() {
        return this.task.status === TaskStatus.COMPLETE;
    }
    get isError() {
        return this.task.status === TaskStatus.ERROR;
    }
    /* =========================
       Controls
    ========================== */
    refetch() {
        this.task.run();
    }
    setEnabled(value) {
        if (this.enabled !== value) {
            this.enabled = value;
            this.host.requestUpdate();
        }
    }
    setUrl(newUrl) {
        if (this.url !== newUrl) {
            this.url = newUrl;
            this.host.requestUpdate();
        }
    }
    setRequestInit(requestInit) {
        this.requestInit = requestInit;
        this.host.requestUpdate();
    }
    setDependencies(deps) {
        this.deps = deps;
        this.host.requestUpdate();
    }
    setParams(params) {
        this.params = params;
        this.host.requestUpdate();
    }
}
//# sourceMappingURL=use-api.js.map