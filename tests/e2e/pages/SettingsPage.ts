import { BasePage } from './BasePage';
import { Locator, Page } from '@playwright/test';

export class SettingsPage extends BasePage {
  readonly modal: Locator;
  readonly closeBtn: Locator;
  readonly fontBtn: Locator;
  readonly appContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.modal = page.locator('text=Settings').first();
    this.closeBtn = page.locator('button').filter({ has: page.locator('svg.lucide-x') });
    this.fontBtn = page.locator('button', { hasText: 'Change Font' });
    this.appContainer = page.locator('.app-container');
  }

  async selectTheme(themeName: string) {
    // Target the list item in the sidebar (which has cursor-pointer class)
    // and exclude the heading in the preview area
    const themeOption = this.page.locator('div.cursor-pointer', { hasText: themeName }).first();
    await themeOption.click();
  }

  async cycleFont() {
    await this.fontBtn.click();
  }

  async close() {
    await this.closeBtn.click();
  }

  async isDarkMode() {
    const html = this.page.locator('html');
    return await html.evaluate((el) => el.classList.contains('dark'));
  }

  async getActiveThemeLabel() {
    // The active theme has the bg-indigo-600 class
    const activeItem = this.page.locator('div.bg-indigo-600');
    return await activeItem.innerText();
  }

  async getCurrentFontFamily() {
    return await this.appContainer.evaluate((el) => getComputedStyle(el).fontFamily);
  }
}
