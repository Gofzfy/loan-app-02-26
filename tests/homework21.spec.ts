import {test} from "@playwright/test";
import {LoanCalcPage} from "../pom/pages/LoanCalcPage";
import {LoanDetailsPage} from "../pom/pages/LoanDetailsPage";

test('Lesson example', async ({ page }) => {
    const loanCalcPage = new LoanCalcPage(page);
    const loanDetailsPage = new LoanDetailsPage(page);
    const mockedMonthlyAmount = 1;

    await page.route(`**/api/loan-calc**`, async route => {
        //await page.waitForTimeout(15000);
        // console.log(route.request().url())
        await route.fulfill({status: 200, json: {paymentAmountMonthly: mockedMonthlyAmount}, contentType: "application/json"});
    });

    await loanCalcPage.goto();
    await loanCalcPage.fillLoanAmount('700');

    const loanCalcResponse = page.waitForResponse('**/api/loan-calc?**');
    await loanCalcPage.fillPeriodAmount('24');
    await loanCalcResponse;

    await loanCalcPage.checkBtn();
    await loanCalcPage.applyButton.click();
    await loanCalcPage.logIn();
    await loanCalcPage.checkBtn(loanDetailsPage.continueBtn);
    await loanDetailsPage.continueBtn.click();
    await loanCalcPage.checkBtn(loanDetailsPage.popupBtnOK);
    await loanDetailsPage.popupBtnOK.click();
    await loanCalcPage.checkBtn();
});

test ('Code 500 with empty body', async ({ page}) => {
    const loanCalcPage = new LoanCalcPage(page);

    await page.route(`**/api/loan-calc**`, async route => {
        await route.fulfill({status: 500, body: ''});
    });

    await loanCalcPage.goto();
    await loanCalcPage.fillLoanAmount('700');
    const loanCalcResponse = page.waitForResponse('**/api/loan-calc?**');
    await loanCalcPage.fillPeriodAmount('24');
    await loanCalcResponse;
    await loanCalcPage.checkError();
})

test ('Code 200 with empty body', async ({ page}) => {
    const loanCalcPage = new LoanCalcPage(page);
    const monthlyLoanResult = 'undefined'

    await page.route(`**/api/loan-calc**`, async route => {
        await route.fulfill({status: 200, body: ''});
    });

    await loanCalcPage.goto();
    await loanCalcPage.fillLoanAmount('700');
    const loanCalcResponse = page.waitForResponse('**/api/loan-calc?**');
    await loanCalcPage.fillPeriodAmount('24');
    await loanCalcResponse;
    await loanCalcPage.checkError(false);
    await loanCalcPage.monthlyPaymentValidation(monthlyLoanResult); // Result indicates frontend bug (undefined)
})

test ('Code 200 with incorrect key', async ({ page}) => {
    const loanCalcPage = new LoanCalcPage(page);
    const mockedMonthlyAmount = 2;
    const monthlyLoanResult = 'undefined'

    await page.route(`**/api/loan-calc**`, async route => {
        await route.fulfill({status: 200, json: {monthlyAmountPayment: mockedMonthlyAmount}, contentType: "application/json"});
    });

    await loanCalcPage.goto();
    await loanCalcPage.fillLoanAmount('700');
    const loanCalcResponse = page.waitForResponse('**/api/loan-calc?**');
    await loanCalcPage.fillPeriodAmount('24');
    await loanCalcResponse;
    await loanCalcPage.checkError(false);
    await loanCalcPage.monthlyPaymentValidation(monthlyLoanResult); // Result indicates frontend bug (undefined)
})