import { Page, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForAppLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.page).toHaveTitle('yam');
  }
}
