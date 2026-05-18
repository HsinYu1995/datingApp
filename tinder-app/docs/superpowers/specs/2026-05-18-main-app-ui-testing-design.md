# Design: Main App UI Verification (Playwright + POM)

**Date:** 2026-05-18  
**Scope:** Playwright tests for the main app (profile stack, swiping, empty states, header)  
**Approach:** Page Object Model (Option B) with mocked auth API calls

---

## 1. Context

The tinder-style app ("Spark") has two layers:

- **Auth layer** — JWT-based auth via `POST /api/v1/auth/refresh` and `GET /api/v1/auth/me`. A `ProtectedRoute` blocks unauthenticated access and redirects to `/login`.
- **Main app layer** — Profile cards loaded from static local data (`src/data/profiles.js`, 5 profiles). Swiping is pure client-side state in `ProfileStack.jsx`. No profile data API calls exist.

Since profiles are static, only the two auth endpoints need mocking. The swipe animation runs on a 400ms `setTimeout` in `handleSwipe()`; tests use Playwright's auto-retrying `expect(locator).not.toHaveText()` to detect card transitions instead of hardcoded waits.

---

## 2. File Structure

```
tests/
  pages/
    MainAppPage.ts        ← POM class: locators + actions for the main app
  fixtures/
    auth.ts               ← shared Playwright fixture mocking /refresh and /me
  main-app.spec.ts        ← 7 test cases
playwright.config.ts      ← baseURL: http://localhost:5173
```

---

## 3. Auth Fixture (`tests/fixtures/auth.ts`)

Intercepts the two auth API calls before each test so the app boots into an authenticated state without a real backend:

- `POST /api/v1/auth/refresh` → `200 { accessToken: 'mock-token' }`
- `GET /api/v1/auth/me` → `200 { email: 'test@example.com' }`

Exported as a Playwright `test.extend` fixture so every test in `main-app.spec.ts` gets it automatically via `beforeEach`.

---

## 4. MainAppPage POM (`tests/pages/MainAppPage.ts`)

### Locators

| Property | Selector | Purpose |
|---|---|---|
| `counter()` | `.card-counter` | "1 / 5" progress text |
| `cardName()` | `.card-name` | Current card's name |
| `cardAge()` | `.card-age` | Current card's age |
| `cardLocation()` | `.card-location` | Current card's location |
| `cardBio()` | `.card-bio` | Current card's bio |
| `interestTags()` | `.interest-tag` | All interest tags on current card |
| `likeButton()` | `.btn-action--like` | ♥ button |
| `passButton()` | `.btn-action--pass` | ✕ button |
| `headerEmail()` | `.header-email` | User email in header |
| `logoutButton()` | `button:has-text("Logout")` | Logout button |
| `emptyMessage()` | `.empty-stack p` | "You've seen everyone!" text |
| `startOverButton()` | `button:has-text("Start Over")` | Start Over button |

### Actions

**`goto()`** — navigate to `/` and wait for `networkidle`.

**`like()`** — click ♥, then poll `.card-counter` until its text changes:
```ts
async like() {
  const before = await this.counter().textContent();
  await this.likeButton().click();
  await expect(this.counter()).not.toHaveText(before!);
}
```

**`pass()`** — same pattern using ✕ button.

**`startOver()`** — click Start Over button.

---

## 5. Test Cases (`tests/main-app.spec.ts`)

All tests share the auth fixture. The static profile data has 5 profiles; the first is Sophia Chen.

| # | Test | Assertion |
|---|---|---|
| 1 | Renders first profile card | `cardName` = "Sophia Chen", `cardAge` contains "26", `cardLocation` contains "San Francisco", `cardBio` visible, `interestTags` count = 4 |
| 2 | Shows correct counter | `counter` text = "1 / 5" |
| 3 | Like advances to next card | After `like()`: counter = "2 / 5", `cardName` ≠ "Sophia Chen" |
| 4 | Pass advances to next card | After `pass()`: counter = "2 / 5", `cardName` ≠ "Sophia Chen" |
| 5 | Shows empty state after last card | Call `like()` 5 times; `emptyMessage` contains "You've seen everyone!" |
| 6 | Start Over resets to first card | After empty state, `startOver()`: counter = "1 / 5", `cardName` = "Sophia Chen" |
| 7 | Header shows user email and Logout | `headerEmail` = "test@example.com", `logoutButton` visible |

---

## 6. Playwright Config

```ts
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
});
```

The dev server must be running (`npm run dev`) before executing the tests. The `with_server.py` helper can manage server lifecycle if running in CI.

---

## 7. What Is Not Covered

- Auth flows (login, register, forgot/reset password) — separate test suite
- Add Profile form — separate test suite
- Protected route redirect (unauthenticated → `/login`) — separate test suite
- Drag-to-swipe gesture interaction (only button clicks tested here)
