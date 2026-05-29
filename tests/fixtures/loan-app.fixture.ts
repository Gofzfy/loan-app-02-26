import { Page, test as base } from '@playwright/test'
import { BE_URL, PASSWORD, SERVICE_URL, USERNAME } from '../../config/env-data'
import {LoanDetailsPage} from "../../pom/pages/LoanDetailsPage";
import {LoanCalcPage} from "../../pom/pages/LoanCalcPage";
// import { ENDPOINTS } from '../../utils/endpoints'
// import { LoginPage } from '../pages/login-page'
// import { OrderPage } from '../pages/order-page'
// import { OrderDetailsPage } from '../pages/order-details-page'
// import { NotFoundPage } from '../pages/order-not-found-page'

type Fixtures = {
    mockedMainPage: Page
    mockedCalcPage: LoanCalcPage
    mockedDetailsPage: LoanDetailsPage
    mockedError500: Page
    mocked200EmptyBody: Page
    // auth: { jwt: string }
    // orderId: string
    // mainPage: Page
    // Login: LoginPage
    // Orders: OrderPage
    // OrdersMocked: OrderPage
    // Details: OrderDetailsPage
    // NotFound: NotFoundPage
}
//
export const test = base.extend<Fixtures>({
    mockedMainPage: async ({ page }, use) => {
        const mainPage = page
        const mockedMonthlyAmount = 1;

        await page.route(`**/api/loan-calc**`, async (route) => {
            await route.fulfill({
                status: 200,
                json: {paymentAmountMonthly: mockedMonthlyAmount},
                contentType: "application/json"});
        })

        await mainPage.goto(SERVICE_URL);
        await use(mainPage);
    },

    mockedCalcPage: async ({ mockedMainPage }, use) => {
        const calcPage = new LoanCalcPage(mockedMainPage);
        await use(calcPage);
    },

    mockedDetailsPage: async ({ mockedMainPage }, use) => {
        const detailsPage = new LoanDetailsPage(mockedMainPage);
        await use(detailsPage);
    },

    mockedError500: async ({ page } , use ) => {
        const mockedError500 = page
        await page.route(`**/api/loan-calc**`, async (route) => {
            await route.fulfill({
                status: 500,
                body: ''
            });
        })
        await mockedError500.goto(SERVICE_URL);
        await use(mockedError500);
    },

    mocked200EmptyBody: async ({ page } , use ) => {
        const mocked200EmptyBody = page
        await page.route(`**/api/loan-calc**`, async (route) => {
            await route.fulfill({
                status: 200,
                body: ''
            });
        })
        await mocked200EmptyBody.goto(SERVICE_URL);
        await use(mocked200EmptyBody);
    }



//     mainPage: async ({ context, auth }, use) => {
//         await context.addInitScript((token) => {
//             localStorage.setItem('jwt', token)
//         }, auth.jwt)
//
//         const mainPage = await context.newPage()
//
//         await mainPage.route(`${BE_URL}${ENDPOINTS.ORDERS}/*`, async (route) => {
//             if (route.request().method() !== 'GET') {
//                 await route.continue()
//             } else {
//                 await route.fulfill({
//                     status: 200,
//                     contentType: 'application/json',
//                     body: JSON.stringify({
//                         status: 'DELIVERED',
//                         courierId: null,
//                         customerName: 'mocked customer',
//                         customerPhone: '99887766',
//                         comment: '',
//                         id: 9999,
//                     }),
//                 })
//             }
//         })
//
//         await mainPage.goto(SERVICE_URL)
//         await use(mainPage)
//     },
//
//     Login: async ({ mainPage }, use) => {
//         const Login = new LoginPage(mainPage)
//         await use(Login)
//     },
//
//     Orders: async ({ page }, use) => {
//         const Orders = new OrderPage(page)
//         await use(Orders)
//     },
//
//     OrdersMocked: async ({ mainPage }, use) => {
//         const OrdersMocked = new OrderPage(mainPage)
//         await use(OrdersMocked)
//     },
//
//     Details: async ({ mainPage }, use) => {
//         const Details = new OrderDetailsPage(mainPage)
//         await use(Details)
//     },
//
//     NotFound: async ({ page, context, auth }, use) => {
//         await context.addInitScript((token) => {
//             localStorage.setItem('jwt', token)
//         }, auth.jwt)
//         const NotFound = new NotFoundPage(page)
//         await use(NotFound)
//     },
})

export { expect } from '@playwright/test'
