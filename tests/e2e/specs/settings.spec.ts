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

  test('should switch themes', async () => {
    await editorPage.openSettings();
    await expect(settingsPage.modal).toBeVisible();

    // Select Dracula
    await settingsPage.selectTheme('Dracula');
    expect(await settingsPage.isDarkMode()).toBe(true);

    await settingsPage.close();
  });

  test('should cycle fonts', async () => {
    const initialFont = await settingsPage.getCurrentFontFamily();
    
    // Toggle font via sidebar (which is on EditorPage really, but SettingsPage has helper for appContainer)
    // Actually, "Change Font" is on the Sidebar.
    // Let's add that to EditorPage or create a SidebarPage. 
    // For now, let's use the locator in SettingsPage if I added it, wait, I added fontBtn to SettingsPage but it might be the wrong button?
    // In Sidebar, button text is "Change Font". In SettingsModal, it's different.
    // The previous test clicked "Change Font" on the Sidebar.
    
    // Let's use the EditorPage sidebar interaction for this.
    const fontBtn = editorPage.page.locator('button', { hasText: 'Change Font' });
    await fontBtn.click();
    
    const newFont = await settingsPage.getCurrentFontFamily();
    expect(newFont).not.toBe(initialFont);
  });
});
