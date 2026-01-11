import { test, expect } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';

test.describe('Yam Website', () => {
  let landingPage: LandingPage;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await landingPage.goto();
  });

  test('should display hero section', async () => {
    await expect(landingPage.heroTitle).toBeVisible();
    await expect(landingPage.downloadBtn).toBeVisible();
  });

  test('should display feature carousel', async () => {
    await expect(landingPage.carousel).toBeVisible();
    // Verify first slide content (e.g. Modern UI or similar)
    // We expect the first feature to be "Modern UI" or "Themes"
    // Let's assume there is a heading inside the carousel
    const slideHeading = landingPage.carousel.locator('h3').first();
    await expect(slideHeading).toBeVisible();
  });

  test('should cycle through features', async () => {
    await expect(landingPage.carousel).toBeVisible();
    
    // Get active slide content
    const firstSlideText = await landingPage.carousel.locator('h3').first().innerText();
    
    // Click next
    await landingPage.cycleFeatures();
    
    // Wait for animation if needed (Playwright auto-waits for visibility)
    // We expect the text to change
    const secondSlideHeading = landingPage.carousel.locator('h3').first();
    await expect(secondSlideHeading).not.toHaveText(firstSlideText);
  });
});
