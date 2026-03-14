import { test, expect, _electron as electron, ElectronApplication } from '@playwright/test';
import path from 'path';
import { EditorPage } from '../pages/EditorPage';
import { SettingsPage } from '../pages/SettingsPage';

test.describe('Settings Workflow', () => {
  let electronApp: ElectronApplication;
  let editorPage: EditorPage;
  let settingsPage: SettingsPage;

  test.beforeAll(async () => {
    const mainScript = path.join(__dirname, '../../../../dist-electron/main.js');
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

    await editorPage.openSettings();
    await expect(settingsPage.modal).toBeVisible();

    const label = await settingsPage.getActiveThemeLabel();
    expect(label).toContain('Dracula');
    expect(label).toContain('(default)');

    await settingsPage.close();
  });

  test('should switch themes and update (default) label', async () => {
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

  test('should cycle fonts via toolbar', async () => {
    const initialFont = await settingsPage.getCurrentFontFamily();

    // Click font cycle button in toolbar
    await editorPage.page.locator('button[title^="Font:"]').click();

    const newFont = await settingsPage.getCurrentFontFamily();
    expect(newFont).not.toBe(initialFont);
  });
});
