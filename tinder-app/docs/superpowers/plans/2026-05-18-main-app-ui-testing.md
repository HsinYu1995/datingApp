# Main App UI Testing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write 7 Playwright tests covering the main app UI (profile card rendering, swiping, empty state, header) using a Page Object Model and mocked auth API calls.

**Architecture:** A shared Playwright fixture mocks the two auth endpoints (`/refresh`, `/me`) so the app boots authenticated without a real backend. A `MainAppPage` POM class encapsulates all locators and actions. Tests import both and stay thin.

**Tech Stack:** Playwright 1.60, TypeScript (Playwright's built-in transpiler), Vite dev server on `localhost:5173`

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `playwright.config.ts` | Playwright base config (baseURL, testDir) |
| Create | `tests/fixtures/auth.ts` | Fixture that mocks `/refresh` + `/me` and provides `MainAppPage` |
| Create | `tests/pages/MainAppPage.ts` | POM: locators + `like()`, `pass()`, `goto()`, `startOver()` |
| Create | `tests/main-app.spec.ts` | 7 test cases |

---

## Task 1: Playwright Config

**Files:**
- Create: `playwright.config.ts`

- [ ] **Step 1: Install Playwright browsers**

```bash
npx playwright install chromium
```

Expected output: `Downloading Chromium ...` followed by `chromium ... downloaded`.

- [ ] **Step 2: Create `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
});
```

- [ ] **Step 3: Verify Playwright is wired up**

```bash
npx playwright --version
```

Expected: `Version 1.60.x`

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts
git commit -m "chore: add playwright config"
```

---

## Task 2: Auth Fixture

**Files:**
- Create: `tests/fixtures/auth.ts`
- Create: `tests/pages/MainAppPage.ts` (stub — full implementation in Task 3)

The fixture intercepts both auth calls before the page navigates, then provides a fully-loaded `MainAppPage` instance to each test.

- [ ] **Step 1: Create the stub POM so the fixture can import it**

Create `tests/pages/MainAppPage.ts`:

```ts
import { Page } from '@playwright/test';

export class MainAppPage {
  constructor(public page: Page) {}

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }
}
```

- [ ] **Step 2: Create `tests/fixtures/auth.ts`**

```ts
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
    const mainApp = new MainAppPage(page);
    await mainApp.goto();
    await use(mainApp);
  },
});

export { expect } from '@playwright/test';
```

- [ ] **Step 3: Commit**

```bash
git add tests/fixtures/auth.ts tests/pages/MainAppPage.ts
git commit -m "test: add auth fixture and MainAppPage stub"
```

---

## Task 3: MainAppPage POM

**Files:**
- Modify: `tests/pages/MainAppPage.ts`

Replace the stub with the full POM. The `like()` and `pass()` methods use `page.waitForFunction` to poll until the counter DOM node changes text OR disappears (empty state after last card) — no hardcoded timeouts.

- [ ] **Step 1: Replace `tests/pages/MainAppPage.ts` with the full implementation**

```ts
import { Page, expect } from '@playwright/test';

export class MainAppPage {
  constructor(public page: Page) {}

  counter()         { return this.page.locator('.card-counter'); }
  cardName()        { return this.page.locator('.stack-card--top .card-name'); }
  cardAge()         { return this.page.locator('.stack-card--top .card-age'); }
  cardLocation()    { return this.page.locator('.stack-card--top .card-location'); }
  cardBio()         { return this.page.locator('.stack-card--top .card-bio'); }
  interestTags()    { return this.page.locator('.stack-card--top .interest-tag'); }
  likeButton()      { return this.page.locator('.btn-action--like'); }
  passButton()      { return this.page.locator('.btn-action--pass'); }
  headerEmail()     { return this.page.locator('.header-email'); }
  logoutButton()    { return this.page.locator('button', { hasText: 'Logout' }); }
  emptyMessage()    { return this.page.locator('.empty-stack p'); }
  startOverButton() { return this.page.locator('button', { hasText: 'Start Over' }); }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async like() {
    const before = await this.counter().textContent();
    await this.likeButton().click();
    await this.page.waitForFunction((prev) => {
      const counter = document.querySelector('.card-counter');
      if (!counter) return true;
      return counter.textContent !== prev;
    }, before);
  }

  async pass() {
    const before = await this.counter().textContent();
    await this.passButton().click();
    await this.page.waitForFunction((prev) => {
      const counter = document.querySelector('.card-counter');
      if (!counter) return true;
      return counter.textContent !== prev;
    }, before);
  }

  async startOver() {
    await this.startOverButton().click();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add tests/pages/MainAppPage.ts
git commit -m "test: implement MainAppPage POM"
```

---

## Task 4: Tests 1 & 2 — Card Renders + Counter

**Files:**
- Create: `tests/main-app.spec.ts`

The first two tests verify the initial render state. The static data has 5 profiles; the first is Sophia Chen with 4 interests.

> **Before running any test:** start the dev server in a separate terminal: `npm run dev`

- [ ] **Step 1: Create `tests/main-app.spec.ts` with tests 1 and 2**

```ts
import { expect } from '@playwright/test';
import { test } from './fixtures/auth';

test('renders first profile card', async ({ mainApp }) => {
  await expect(mainApp.cardName()).toHaveText('Sophia Chen');
  await expect(mainApp.cardAge()).toContainText('26');
  await expect(mainApp.cardLocation()).toContainText('San Francisco');
  await expect(mainApp.cardBio()).toBeVisible();
  await expect(mainApp.interestTags()).toHaveCount(4);
});

test('shows correct counter', async ({ mainApp }) => {
  await expect(mainApp.counter()).toHaveText('1 / 5');
});
```

- [ ] **Step 2: Run the tests**

```bash
npx playwright test tests/main-app.spec.ts --reporter=list
```

Expected:
```
✓ renders first profile card
✓ shows correct counter
```

Both tests must pass before continuing.

- [ ] **Step 3: Commit**

```bash
git add tests/main-app.spec.ts
git commit -m "test: add card render and counter tests"
```

---

## Task 5: Tests 3 & 4 — Like and Pass Advance the Card

**Files:**
- Modify: `tests/main-app.spec.ts`

Both Like and Pass should advance `currentIndex` by 1, changing the counter to `2 / 5` and showing a different profile card name.

- [ ] **Step 1: Append tests 3 and 4 to `tests/main-app.spec.ts`**

```ts
test('Like advances to next card', async ({ mainApp }) => {
  await mainApp.like();
  await expect(mainApp.counter()).toHaveText('2 / 5');
  await expect(mainApp.cardName()).not.toHaveText('Sophia Chen');
});

test('Pass advances to next card', async ({ mainApp }) => {
  await mainApp.pass();
  await expect(mainApp.counter()).toHaveText('2 / 5');
  await expect(mainApp.cardName()).not.toHaveText('Sophia Chen');
});
```

- [ ] **Step 2: Run the tests**

```bash
npx playwright test tests/main-app.spec.ts --reporter=list
```

Expected: all 4 tests pass.

- [ ] **Step 3: Commit**

```bash
git add tests/main-app.spec.ts
git commit -m "test: add Like and Pass swipe tests"
```

---

## Task 6: Tests 5 & 6 — Empty State and Start Over

**Files:**
- Modify: `tests/main-app.spec.ts`

After 5 swipes the stack is exhausted and `ProfileStack` renders the empty state (`.empty-stack`). The counter is no longer in the DOM. Test 5 swipes 4 times via `like()` then clicks the Like button directly for the last card and waits for the empty message — this avoids relying on `like()` for the transition where the counter disappears.

- [ ] **Step 1: Append tests 5 and 6 to `tests/main-app.spec.ts`**

```ts
test('shows empty state after last card', async ({ mainApp }) => {
  for (let i = 0; i < 4; i++) {
    await mainApp.like();
  }
  await mainApp.likeButton().click();
  await expect(mainApp.emptyMessage()).toContainText("You've seen everyone!");
});

test('Start Over resets to first card', async ({ mainApp }) => {
  for (let i = 0; i < 4; i++) {
    await mainApp.like();
  }
  await mainApp.likeButton().click();
  await expect(mainApp.emptyMessage()).toBeVisible();
  await mainApp.startOver();
  await expect(mainApp.counter()).toHaveText('1 / 5');
  await expect(mainApp.cardName()).toHaveText('Sophia Chen');
});
```

- [ ] **Step 2: Run the tests**

```bash
npx playwright test tests/main-app.spec.ts --reporter=list
```

Expected: all 6 tests pass.

- [ ] **Step 3: Commit**

```bash
git add tests/main-app.spec.ts
git commit -m "test: add empty state and Start Over tests"
```

---

## Task 7: Test 7 — Header

**Files:**
- Modify: `tests/main-app.spec.ts`

Verifies the mocked user email appears in the header and the Logout button is visible.

- [ ] **Step 1: Append test 7 to `tests/main-app.spec.ts`**

```ts
test('header shows user email and Logout button', async ({ mainApp }) => {
  await expect(mainApp.headerEmail()).toHaveText('test@example.com');
  await expect(mainApp.logoutButton()).toBeVisible();
});
```

- [ ] **Step 2: Run the full suite**

```bash
npx playwright test tests/main-app.spec.ts --reporter=list
```

Expected: all 7 tests pass.

- [ ] **Step 3: Commit**

```bash
git add tests/main-app.spec.ts
git commit -m "test: add header email and Logout button test"
```
