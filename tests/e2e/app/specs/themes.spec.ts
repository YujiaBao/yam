import { test, expect, _electron as electron, ElectronApplication } from '@playwright/test';
import path from 'path';
import { EditorPage } from '../pages/EditorPage';
import { SettingsPage } from '../pages/SettingsPage';

test.describe('Extended Theme Workflow', () => {
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

  const newThemes = [
    'Monokai',
    "Synthwave '84",
    'Gruvbox Dark',
    'Cyberpunk'
  ];

  for (const theme of newThemes) {
    test(`should switch to ${theme} theme`, async () => {
      // Ensure sidebar is open to access settings
      if (await editorPage.sidebar.isHidden()) {
        await editorPage.toggleSidebar();
      }
      await editorPage.openSettings();
      await expect(settingsPage.modal).toBeVisible();

      // Select Theme
      await settingsPage.selectTheme(theme);
      
      // Verify Dark Mode
      expect(await settingsPage.isDarkMode()).toBe(true);

      // Verify Active State in List
      // The active theme in the list has a specific background color class usually, 
      // but testing for "bg-indigo-600" or similar might be brittle.
      // We can check if the heading updated to the new theme name.
      const previewHeading = settingsPage.page.locator('h3.text-sm.font-medium');
      await expect(previewHeading).toHaveText(theme);

      await settingsPage.close();
    });
  }
});
