import { LitElement, PropertyValues } from "lit";
import "../components/app-loader.js";
import "../components/close-button.js";
import "../components/wifi-loader.js";
export declare class CryptoPay extends LitElement {
    static styles: import("lit").CSSResult;
    private step;
    paymentToken: string;
    private selectedCrypto;
    amount: number;
    private qrInfo;
    enabled: boolean;
    private dialog;
    private isDialogOpen;
    private qrWalletAddress;
    private transaction;
    private tokenList;
    private exchange;
    get equivalentCrypto(): string;
    private expire;
    updated(changed: Map<string, unknown>): void;
    protected willUpdate(_changedProperties: PropertyValues): void;
    open(): void;
    close(): void;
    private goToPayment;
    private markSuccess;
    private markFailed;
    private handleAmountChange;
    private renderStep1;
    private renderStep2;
    private renderStep3;
    private renderStep4;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=index.d.ts.map