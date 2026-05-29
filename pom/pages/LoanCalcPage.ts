import {expect, Locator, Page} from "@playwright/test";
import {LoginPopup} from "../organisms/LoginPopup";
import {LoanDetailsPage} from "./LoanDetailsPage";
// @ts-ignore
import {faker} from "@faker-js/faker/locale/en"


export class LoanCalcPage {
    readonly page: Page;
    readonly url = 'https://loan-app.tallinn-learning.ee/small-loan'
    readonly loanCalc: Locator;
    readonly imageContainer1: Locator;
    readonly imageContainer1Button: Locator;
    readonly imageContainer2: Locator;
    readonly imageContainer2Button: Locator;
    readonly inputLoanAmount: Locator;
    readonly inputLoanAmountSlider: Locator;
    readonly selectPeriodAmount: Locator;
    readonly selectPeriodAmountSlider: Locator;
    readonly monthlyPaymentAmount: Locator;
    readonly invalidInputError: Locator;
    readonly applyButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loanCalc = page.locator('.Container').nth(0);
        this.imageContainer1 = page.locator('.Container').nth(1);
        this.imageContainer1Button = this.imageContainer1.getByTestId('id-image-element-button-image-1');
        this.imageContainer2 = page.locator('.Container').nth(2);
        this.imageContainer2Button = this.imageContainer2.getByTestId('id-image-element-button-image-2');
        this.inputLoanAmount = this.loanCalc.getByTestId('id-small-loan-calculator-field-amount');
        this.inputLoanAmountSlider = this.loanCalc.getByTestId('id-small-loan-calculator-field-amount-slider');
        this.selectPeriodAmount = this.loanCalc.getByTestId('ib-small-loan-calculator-field-period');
        this.selectPeriodAmountSlider = this.loanCalc.getByTestId('ib-small-loan-calculator-field-period-slider');
        this.monthlyPaymentAmount = this.loanCalc.getByTestId('ib-small-loan-calculator-field-monthlyPayment');
        this.invalidInputError = this.loanCalc.getByTestId('id-small-loan-calculator-field-error');
        this.applyButton = this.loanCalc.getByTestId('id-small-loan-calculator-field-apply');
    }

    async goto(): Promise<void> {
        await this.page.goto(this.url);
    }

    async fillLoanAmount(text: string): Promise<void> {
        await this.inputLoanAmount.fill(text);
    }

    async fillPeriodAmount(option: string): Promise<void> {
        await this.selectPeriodAmount.selectOption(option);
    }

    async logIn(): Promise<void> {
        const loginPopup = new LoginPopup(this.page);
        await expect(loginPopup.loginBtn).toBeDisabled();
        await loginPopup.loginString.fill(faker.person.firstName());
        await loginPopup.passwordString.fill(faker.person.lastName());
        await expect(loginPopup.loginBtn).toBeEnabled();
        await loginPopup.loginBtn.click();
    }

    async checkBtn(btn?: Locator): Promise<void> {
        const check = (btn == undefined ? this.applyButton: btn);
        await expect(check).toBeVisible();
        await expect(check).toBeEnabled();
        await check.scrollIntoViewIfNeeded();
        await expect(check).toBeInViewport();
    }

    async checkViewport(btn: Locator, visible: boolean = true): Promise<void> {
        if (visible == true) {
            await expect(btn).toBeInViewport();
        } else {
            await expect(btn).not.toBeInViewport();
        }
    }

    async checkError(visible: boolean = true): Promise<void> {
        await expect(this.invalidInputError).toBeVisible({visible});
    }

    async monthlyPaymentValidation(amount: string): Promise<void> {
        expect((await this.monthlyPaymentAmount.innerText()).split(' ')[0]).toBe(amount)
    }
}