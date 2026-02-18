import { LitElement } from "lit";
import "../pay-modals/index.js";
export declare class PayButton extends LitElement {
    static styles: import("lit").CSSResult;
    btnTxt: string;
    amount: number;
    paymentToken: string;
    private cryptoPay;
    private openDialog;
    private handleSuccess;
    private handleFailure;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "pay-button": PayButton;
    }
}
//# sourceMappingURL=index.d.ts.map