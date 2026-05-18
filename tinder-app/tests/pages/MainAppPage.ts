import { Page } from '@playwright/test';

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
    await this.counter().or(this.emptyMessage()).waitFor({ state: 'visible' });
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
