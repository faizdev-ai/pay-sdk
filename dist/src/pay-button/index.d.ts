import { LitElement } from "lit";
import "../pay-modals/index.js";
export interface PayButtonProps {
    btnTxt?: String;
    amount: number;
    paymentToken: String;
}
export declare class PayButton extends LitElement implements PayButtonProps {
    static styles: import("lit").CSSResult;
    btnTxt: string;
    amount: number;
    paymentToken: string;
    private cryptoPay;
    dialogEnabled: boolean;
    private openDialog;
    private handleSuccess;
    private handleFailure;
    private handleClose;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=index.d.ts.map