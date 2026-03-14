import { BasePage } from './BasePage';
import { Locator, Page } from '@playwright/test';

export class EditorPage extends BasePage {
  readonly editor: Locator;
  readonly preview: Locator;
  readonly toolbar: Locator;
  readonly settingsBtn: Locator;

  constructor(page: Page) {
    super(page);
    // Selectors
    this.editor = page.locator('textarea').first();
    this.preview = page.locator('.markdown-body');
    this.toolbar = page.locator('button[title="Settings"]').locator('..');
    this.settingsBtn = page.locator('button[title="Settings"]');
  }

  async typeMarkdown(text: string) {
    await this.editor.fill(text);
  }

  async getPreviewText() {
    return this.preview.innerText();
  }

  async openSettings() {
    await this.settingsBtn.click();
  }
}
