import { BasePage } from './BasePage';
import { Locator, Page } from '@playwright/test';

export class SettingsPage extends BasePage {
  readonly modal: Locator;
  readonly closeBtn: Locator;
  readonly fontBtn: Locator;
  readonly appContainer: Locator;
  
  // Tabs
  readonly themesTab: Locator;
  readonly fontsTab: Locator;
  readonly generalTab: Locator;

  constructor(page: Page) {
    super(page);
    this.modal = page.locator('text=Settings').first();
    this.closeBtn = page.locator('button').filter({ has: page.locator('svg.lucide-x') });
    this.fontBtn = page.locator('button', { hasText: 'Change Font' });
    this.appContainer = page.locator('.app-container');
    
    this.themesTab = page.locator('button', { hasText: 'Themes' });
    this.fontsTab = page.locator('button', { hasText: 'Fonts' });
    this.generalTab = page.locator('button', { hasText: 'General' });
  }

  async selectTheme(themeName: string) {
    // Target the list item in the sidebar (which has cursor-pointer class)
    // and exclude the heading in the preview area
    const themeOption = this.page.locator('div.cursor-pointer', { hasText: themeName }).first();
    await themeOption.click();
  }

  async getActiveThemeLabel() {
    // The active theme has the bg-indigo-600 class
    const activeItem = this.page.locator('div.bg-indigo-600');
    return await activeItem.innerText();
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

  async getCurrentFontFamily() {
    return await this.appContainer.evaluate((el) => getComputedStyle(el).fontFamily);
  }

  async switchToGeneralTab() {
    await this.generalTab.click();
  }

  async setLaunchViewMode(mode: 'Editor Only' | 'Split View' | 'Preview Only') {
    // Find the section "When opening Yam directly" and then the button
    const section = this.page.locator('div', { hasText: 'When opening Yam directly' }).last();
    await section.locator('button', { hasText: mode }).click();
  }

  async setFileOpenViewMode(mode: 'Editor Only' | 'Split View' | 'Preview Only') {
    const section = this.page.locator('div', { hasText: 'When opening a file' }).last();
    await section.locator('button', { hasText: mode }).click();
  }
}