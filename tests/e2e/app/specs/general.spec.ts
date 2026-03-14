import { test, expect, _electron as electron, ElectronApplication } from '@playwright/test';
import path from 'path';
import { EditorPage } from '../pages/EditorPage';
import { SettingsPage } from '../pages/SettingsPage';

test.describe('General Settings Workflow', () => {
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

  test('should display new default content', async () => {
    await expect(editorPage.preview).toContainText('Welcome to Yam');
    await expect(editorPage.preview).toContainText('Antoine de Saint-Exupéry');
  });

  test('should configure startup view modes and custom content in General tab', async () => {
    await editorPage.openSettings();
    await expect(settingsPage.modal).toBeVisible();

    await settingsPage.switchToGeneralTab();

    // Verify defaults
    const launchSplit = settingsPage.page.locator('button', { hasText: 'Split View' }).first();
    await expect(launchSplit).toHaveClass(/bg-indigo-50/);

    // Change Launch to Editor Only
    await settingsPage.setLaunchViewMode('Editor Only');
    const launchEdit = settingsPage.page.locator('button', { hasText: 'Editor Only' }).first();
    await expect(launchEdit).toHaveClass(/bg-indigo-50/);

    // Test Custom Default Content
    const contentEditor = settingsPage.page.locator('textarea[placeholder="Loading default content..."]');
    // It should load the file content initially
    await expect(contentEditor).toHaveValue(/Welcome to Yam/);

    await contentEditor.fill('# Custom Header');
    
    const savedContent = await settingsPage.page.evaluate(() => localStorage.getItem('yam_custom_default_content'));
    expect(savedContent).toBe('# Custom Header');

    // Reset
    settingsPage.page.on('dialog', dialog => dialog.accept());
    await settingsPage.page.locator('button', { hasText: 'RESET TO FACTORY' }).click();
    // Should revert to file content
    await expect(contentEditor).toHaveValue(/Welcome to Yam/);

    await settingsPage.close();
  });
});
