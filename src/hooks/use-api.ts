import { ReactiveControllerHost } from "lit";
import { Task, TaskStatus } from "@lit/task";
// http://192.168.89.118:5080/api
// export const baseUrl = "https://paymentgateway-backend.chainbull.net/api";
export const baseUrl = "http://192.168.89.171:5050/api";

interface UseApiOptions {
  enabled?: boolean;
  requestInit?: RequestInit;
  deps?: unknown[];
  params?: Record<string, string | number | boolean | undefined>;
}

export class UseApi<T> {
  private host: ReactiveControllerHost;
  private url: string;
  private enabled: boolean;
  private requestInit?: RequestInit;
  private deps: unknown[];
  private params?: Record<string, string | number | boolean | undefined>;

  private task: Task<
    [
      string,
      RequestInit | undefined,
      boolean,
      Record<string, string | number | boolean | undefined> | undefined,
      ...unknown[],
    ],
    T
  >;

  constructor(
    host: ReactiveControllerHost,
    url: string,
    options: UseApiOptions = {},
  ) {
    this.host = host;
    this.url = url;
    this.enabled = options.enabled ?? true;
    this.requestInit = options.requestInit;
    this.deps = options.deps ?? [];
    this.params = options.params;

    this.task = new Task(this.host, {
      task: async ([url, requestInit, enabled, params], { signal }) => {
        if (!enabled) {
          return new Promise<T>(() => {});
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

  get data(): T | undefined {
    return this.task.status === TaskStatus.COMPLETE
      ? this.task.value
      : undefined;
  }

  get loading(): boolean {
    return this.task.status === TaskStatus.PENDING;
  }

  get error(): unknown {
    return this.task.status === TaskStatus.ERROR ? this.task.error : undefined;
  }

  get status(): TaskStatus {
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

  setEnabled(value: boolean) {
    if (this.enabled !== value) {
      this.enabled = value;
      this.host.requestUpdate();
    }
  }

  setUrl(newUrl: string) {
    if (this.url !== newUrl) {
      this.url = newUrl;
      this.host.requestUpdate();
    }
  }

  setRequestInit(requestInit?: RequestInit) {
    this.requestInit = requestInit;
    this.host.requestUpdate();
  }

  setDependencies(deps: unknown[]) {
    this.deps = deps;
    this.host.requestUpdate();
  }

  setParams(params?: Record<string, string | number | boolean | undefined>) {
    this.params = params;
    this.host.requestUpdate();
  }
}
