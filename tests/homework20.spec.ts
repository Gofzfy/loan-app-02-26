import {test} from "@playwright/test";
import {LoanCalcPage} from "../pom/pages/LoanCalcPage";
import {LoanDetailsPage} from "../pom/pages/LoanDetailsPage";



test('Main flow test', async ({ page }) => {
    const loanCalcPage = new LoanCalcPage(page);
    const loanDetailsPage = new LoanDetailsPage(page);
    await loanCalcPage.goto();

    await loanCalcPage.fillLoanAmount('700');
    await loanCalcPage.fillPeriodAmount('24');
    await loanCalcPage.checkBtn();
    await loanCalcPage.applyButton.click();
    await loanCalcPage.logIn();
    await loanCalcPage.checkBtn(loanDetailsPage.continueBtn);
    await loanDetailsPage.continueBtn.click();
    await loanCalcPage.checkBtn(loanDetailsPage.popupBtnOK);
    await loanDetailsPage.popupBtnOK.click();
    await loanCalcPage.checkBtn();
});

test('Main page first container scroll test', async ({ page }) => {
    const loanCalcPage = new LoanCalcPage(page);
    await loanCalcPage.goto();

    await loanCalcPage.checkBtn();
    await loanCalcPage.checkViewport(loanCalcPage.imageContainer1Button, false);
    await loanCalcPage.imageContainer1.scrollIntoViewIfNeeded();
    await loanCalcPage.checkViewport(loanCalcPage.imageContainer1Button);
    await loanCalcPage.checkViewport(loanCalcPage.inputLoanAmount, false);
    await loanCalcPage.loanCalc.scrollIntoViewIfNeeded();
    await loanCalcPage.checkBtn();
    await loanCalcPage.checkViewport(loanCalcPage.imageContainer1Button, false);
})

test('Main page second container scroll test', async ({ page }) => {
    const loanCalcPage = new LoanCalcPage(page);
    await loanCalcPage.goto();

    await loanCalcPage.checkBtn();
    await loanCalcPage.checkViewport(loanCalcPage.imageContainer2Button, false);
    await loanCalcPage.imageContainer2.scrollIntoViewIfNeeded();
    await loanCalcPage.checkViewport(loanCalcPage.imageContainer2Button);
    await loanCalcPage.checkViewport(loanCalcPage.inputLoanAmount, false);
    await loanCalcPage.loanCalc.scrollIntoViewIfNeeded();
    await loanCalcPage.checkBtn();
    await loanCalcPage.checkViewport(loanCalcPage.imageContainer2Button, false);
})

test('Invalid input error test', async ({ page}) => {
    const loanCalcPage = new LoanCalcPage(page);
    await loanCalcPage.goto();

    await loanCalcPage.checkError(false);
    await loanCalcPage.fillLoanAmount('400');
    await page.waitForTimeout(2000);
    await loanCalcPage.checkError();
    await loanCalcPage.fillLoanAmount('600');
    await page.waitForTimeout(2000);
    await loanCalcPage.checkError(false);
});

test('User Input test', async ({ page }) => {
    const loanCalcPage = new LoanCalcPage(page);
    const loanDetailsPage = new LoanDetailsPage(page);
    const userLoanInput = '999'
    const userPeriodAmount = '32'
    await loanCalcPage.goto();

    await loanCalcPage.fillLoanAmount(userLoanInput);
    await loanCalcPage.fillPeriodAmount(userPeriodAmount);
    await page.waitForTimeout(2000);
    const initialMonthlyPayment = await loanCalcPage.monthlyPaymentAmount.textContent();
    await loanCalcPage.applyButton.click();
    await loanCalcPage.logIn();
    await loanCalcPage.checkBtn(loanDetailsPage.continueBtn);
    loanDetailsPage.compareInput(userLoanInput, await loanDetailsPage.finalAmount.innerText());
    loanDetailsPage.compareInput(initialMonthlyPayment, await loanDetailsPage.monthlyPayment.innerText());
    loanDetailsPage.compareInput(userPeriodAmount, await loanDetailsPage.finalPeriod.innerText());
});