import {expect, Locator, Page} from "@playwright/test";


export class LoanDetailsPage {
    readonly page: Page;
    readonly finalAmount: Locator;
    readonly monthlyPayment: Locator;
    readonly finalPeriod: Locator;
    readonly fullName: Locator;
    readonly commLanguage: Locator;
    readonly continueBtn: Locator;
    readonly popupBtnOK: Locator;

    constructor(page: Page) {
        this.page = page;
        this.finalAmount = page.getByTestId('final-page-amount');
        this.monthlyPayment = page.getByTestId('final-page-monthly-payment');
        this.finalPeriod = page.getByTestId('final-page-period');
        this.fullName = page.getByTestId('final-page-full-name');
        this.commLanguage = page.getByTestId('final-page-communication-language');
        this.continueBtn = page.getByTestId('final-page-continue-button');
        this.popupBtnOK = page.getByTestId('final-page-success-ok-button');

    }

    compareInput(input: string | null, result: string): void {
        expect(result).toContain(input);
    }
}