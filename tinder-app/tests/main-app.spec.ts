import { test, expect } from './fixtures/auth';

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

test('shows empty state after last card', async ({ mainApp }) => {
  for (let i = 0; i < 4; i++) {
    await mainApp.like();
  }
  // like() polls .card-counter for changes; on the 5th swipe the counter
  // leaves the DOM entirely, so we click directly and wait for empty state
  await mainApp.likeButton().click();
  await expect(mainApp.emptyMessage()).toContainText("You've seen everyone!");
});

test('Start Over resets to first card', async ({ mainApp }) => {
  for (let i = 0; i < 4; i++) {
    await mainApp.like();
  }
  // like() polls .card-counter for changes; on the 5th swipe the counter
  // leaves the DOM entirely, so we click directly and wait for empty state
  await mainApp.likeButton().click();
  await expect(mainApp.emptyMessage()).toBeVisible();
  await mainApp.startOver();
  await expect(mainApp.counter()).toHaveText('1 / 5');
  await expect(mainApp.cardName()).toHaveText('Sophia Chen');
});

test('header shows user email and Logout button', async ({ mainApp }) => {
  await expect(mainApp.headerEmail()).toHaveText('test@example.com');
  await expect(mainApp.logoutButton()).toBeVisible();
});
