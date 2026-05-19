import { test as base } from '@playwright/test';
import { MainAppPage } from '../pages/MainAppPage';

type Fixtures = { mainApp: MainAppPage };

export const test = base.extend<Fixtures>({
  mainApp: async ({ page }, use) => {
    await page.route('**/api/v1/auth/refresh', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ accessToken: 'mock-token' }),
      })
    );
    await page.route('**/api/v1/auth/me', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ email: 'test@example.com' }),
      })
    );
    await page.route('**/api/v1/auth/logout', (route) =>
      route.fulfill({ status: 204 })
    );
    const mainApp = new MainAppPage(page);
    await mainApp.goto();
    await use(mainApp);
  },
});

export { expect } from '@playwright/test';
