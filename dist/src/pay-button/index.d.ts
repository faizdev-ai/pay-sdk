import { LitElement } from "lit";
import "../pay-modals/index.js";
export declare class PayButton extends LitElement {
    static styles: import("lit").CSSResult;
    btnTxt: string;
    amount: number;
    private cryptoPay;
    paymentToken: string;
    private openDialog;
    private handleSuccess;
    private handleFailure;
    render(): import("lit-html").TemplateResult<1>;
}
