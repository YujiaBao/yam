import { test, expect, _electron as electron, ElectronApplication } from '@playwright/test';
import path from 'path';
import { EditorPage } from '../pages/EditorPage';
import { SettingsPage } from '../pages/SettingsPage';

test.describe('Settings Workflow', () => {
  let electronApp: ElectronApplication;
  let editorPage: EditorPage;
  let settingsPage: SettingsPage;

  test.beforeAll(async () => {
    const mainScript = path.join(__dirname, '../../../dist-electron/main.js');
    electronApp = await electron.launch({
      args: [mainScript],
      env: { ...process.env, NODE_ENV: 'production' }
    });
    const window = await electronApp.firstWindow();
    editorPage = new EditorPage(window);
    settingsPage = new SettingsPage(window);
    await editorPage.waitForAppLoad();
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test('should have Dracula as initial default theme and show (default) label', async () => {
    // Clear localStorage to simulate first run
    await editorPage.page.evaluate(() => localStorage.clear());
    await editorPage.page.reload();
    await editorPage.waitForAppLoad();

    await editorPage.toggleSidebar();
    await editorPage.openSettings();
    await expect(settingsPage.modal).toBeVisible();

    const label = await settingsPage.getActiveThemeLabel();
    expect(label).toContain('Dracula');
    expect(label).toContain('(default)');

    await settingsPage.close();
  });

  test('should switch themes and update (default) label', async () => {
    // Open sidebar first
    if (await editorPage.sidebar.isHidden()) {
        await editorPage.toggleSidebar();
    }
    await editorPage.openSettings();
    await expect(settingsPage.modal).toBeVisible();

    // Select GitHub Light
    await settingsPage.selectTheme('GitHub Light');
    expect(await settingsPage.isDarkMode()).toBe(false);

    // Verify label moved
    const label = await settingsPage.getActiveThemeLabel();
    expect(label).toContain('GitHub Light');
    expect(label).toContain('(default)');

    await settingsPage.close();
  });

  test('should cycle fonts', async () => {
    const initialFont = await settingsPage.getCurrentFontFamily();
    
    // Sidebar should already be open from previous test (if using same instance)
    // but better to be safe and ensure it's open. 
    // In beforeAll we created a fresh instance, but tests in a file run sequentially.
    // If they share the window, we should handle the state. 
    // Here we just toggle if hidden.
    if (await editorPage.sidebar.isHidden()) {
        await editorPage.toggleSidebar();
    }

    const fontBtn = editorPage.page.locator('button', { hasText: 'Change Font' });
    await fontBtn.click();
    
    const newFont = await settingsPage.getCurrentFontFamily();
    expect(newFont).not.toBe(initialFont);
  });
});
