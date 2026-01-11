import { Page, Locator } from '@playwright/test';

export class LandingPage {
  readonly page: Page;
  readonly heroTitle: Locator;
  readonly downloadBtn: Locator;
  readonly carousel: Locator;
  readonly nextFeatureBtn: Locator;
  readonly prevFeatureBtn: Locator;
  
  constructor(page: Page) {
    this.page = page;
    // Target the main h1 explicitly
    this.heroTitle = page.locator('h1.text-6xl');
    this.downloadBtn = page.getByRole('link', { name: /Download for macOS/i });
    this.carousel = page.locator('[data-testid="feature-carousel"]');
    this.nextFeatureBtn = page.locator('button[aria-label="Next feature"]').first();
    this.prevFeatureBtn = page.locator('button[aria-label="Previous feature"]').first();
  }

  async goto() {
    await this.page.goto('/');
  }

  async cycleFeatures() {
    await this.nextFeatureBtn.click();
  }
}
