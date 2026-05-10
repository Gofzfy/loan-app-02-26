import {Locator, Page} from "@playwright/test";

export class LoginPopup {
    readonly page: Page;
    readonly loginString: Locator;
    readonly passwordString: Locator;
    readonly loginBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginString = page.getByTestId('login-popup-username-input');
        this.passwordString = page.getByTestId('login-popup-password-input');
        this.loginBtn = page.getByTestId('login-popup-continue-button');
    };
}