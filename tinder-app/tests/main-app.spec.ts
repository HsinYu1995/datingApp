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
