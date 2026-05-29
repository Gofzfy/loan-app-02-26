import { LoanCalcPage } from "../pom/pages/LoanCalcPage";
import { test } from "./fixtures/loan-app.fixture"
import { ENDPOINTS } from "../utils/endpoints";

test.describe('Rebuilding test cases using fixtures', () => {
    test('Lesson example with fixtures', async ({ page, mockedCalcPage, mockedDetailsPage }) => {
        await mockedCalcPage.fillLoanAmount('700');

        const loanCalcResponse = page.waitForResponse(`**${ENDPOINTS.MONTHLY_PAYMENT}**`);
        await mockedCalcPage.fillPeriodAmount('24');
        await loanCalcResponse;

        await mockedCalcPage.checkBtn();
        await mockedCalcPage.applyButton.click();
        await mockedCalcPage.logIn();
        await mockedCalcPage.checkBtn(mockedDetailsPage.continueBtn);
        await mockedDetailsPage.continueBtn.click();
        await mockedCalcPage.checkBtn(mockedDetailsPage.popupBtnOK);
        await mockedDetailsPage.popupBtnOK.click();
        await mockedCalcPage.checkBtn();
    });

    test ('Code 500 with empty body with fixtures', async ({ page, mockedError500 }) => {
        const loanCalcPage = new LoanCalcPage(mockedError500);

        await loanCalcPage.fillLoanAmount('700');
        const loanCalcResponse = page.waitForResponse(`**${ENDPOINTS.MONTHLY_PAYMENT}**`);
        await loanCalcPage.fillPeriodAmount('24');
        await loanCalcResponse;
        await loanCalcPage.checkError();
    })

    test ('Code 200 with empty body with fixtures', async ({ page, mocked200EmptyBody}) => {
        const loanCalcPage = new LoanCalcPage(mocked200EmptyBody);
        const monthlyLoanResult = 'undefined'

        await loanCalcPage.fillLoanAmount('700');
        const loanCalcResponse = page.waitForResponse(`**${ENDPOINTS.MONTHLY_PAYMENT}**`);
        await loanCalcPage.fillPeriodAmount('24');
        await loanCalcResponse;
        await loanCalcPage.checkError(false);
        await loanCalcPage.monthlyPaymentValidation(monthlyLoanResult); // Result indicates frontend bug (undefined)
    })
})