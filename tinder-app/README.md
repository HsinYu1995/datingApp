# Spark

A Tinder-style profile swiping app built with React. Users authenticate, browse a card stack, and swipe Like or Pass on profiles. New profiles can be added via a modal form.

Auth is JWT-based — access tokens are stored in memory, refresh tokens in an httpOnly cookie. Expired tokens are silently refreshed in the background with no visible re-login. The auth backend is a separate Spring Boot service ([spring-boot-auth-service](https://github.com/HsinYu1995/spring-boot-auth-service) — work in progress). Profile data is currently served from static local data; no profile API exists yet.


## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19, React Router 7 |
| Forms | React Hook Form 7 |
| HTTP | Axios (with token-refresh interceptor) |
| Build | Vite 8 |
| Testing | Playwright 1.60 |
| Containerisation | Docker + nginx (prod), Vite dev server (dev) |

## Prerequisites

- Node.js 18+
- The [spring-boot-auth-service](https://github.com/HsinYu1995/spring-boot-auth-service) running on `http://localhost:8080` (see that repo for setup instructions)

## Quick Start

```bash
git clone https://github.com/HsinYu1995/datingApp.git
cd datingApp/tinder-app
npm install
npm run dev
```

The app runs at `http://localhost:5173`. API requests to `/api/**` are proxied to `http://localhost:8080` — make sure the backend is running first.

## Running Tests

Playwright is used for end-to-end UI testing. The dev server starts automatically when tests run.

```bash
# Install browsers (first time only)
npx playwright install chromium

# Run the full suite
npx playwright test tests/main-app.spec.ts --reporter=list
```

The suite covers: profile card rendering, Like/Pass swiping, empty state, Start Over, and the header. Auth API calls are mocked — no running backend required for tests.

## Project Structure

```
src/
├── api/            # Axios instance with Bearer token + silent refresh interceptor
├── components/     # ProfileCard, ProfileStack, AddProfileForm, ProtectedRoute
├── context/        # AuthContext (user state, login/logout), ProfileContext
├── data/           # Static profile seed data
├── pages/          # LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage
└── App.jsx         # Router + protected route setup

tests/
├── fixtures/       # Shared Playwright auth fixture (mocks /refresh, /me, /logout)
├── pages/          # MainAppPage POM (locators + swipe actions)
└── main-app.spec.ts
```
