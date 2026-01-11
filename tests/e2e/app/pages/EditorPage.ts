import { BasePage } from './BasePage';
import { Locator, Page } from '@playwright/test';

export class EditorPage extends BasePage {
  readonly editor: Locator;
  readonly preview: Locator;
  readonly sidebar: Locator;
  readonly collapseSidebarBtn: Locator;
  readonly showSidebarBtn: Locator;
  readonly settingsBtn: Locator;

  constructor(page: Page) {
    super(page);
    // Selectors
    this.editor = page.locator('textarea').first();
    this.preview = page.locator('.markdown-body');
    this.sidebar = page.locator('aside');
    this.collapseSidebarBtn = page.locator('button[title="Collapse Sidebar"]');
    this.showSidebarBtn = page.locator('button[title="Show Sidebar"]');
    this.settingsBtn = page.locator('button').filter({ has: page.locator('svg.lucide-settings') });
  }

  async typeMarkdown(text: string) {
    await this.editor.fill(text);
  }

  async getPreviewText() {
    return this.preview.innerText();
  }

  async toggleSidebar() {
    if (await this.sidebar.isVisible()) {
      await this.collapseSidebarBtn.click();
    } else {
      await this.showSidebarBtn.click();
    }
  }

  async openSettings() {
    await this.settingsBtn.click();
  }
}
