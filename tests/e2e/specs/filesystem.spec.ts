import { test, expect, _electron as electron, ElectronApplication } from '@playwright/test';
import path from 'path';
import { EditorPage } from '../pages/EditorPage';

test.describe('Filesystem & PDF', () => {
  let electronApp: ElectronApplication;
  let editorPage: EditorPage;

  test.beforeAll(async () => {
    const mainScript = path.join(__dirname, '../../../dist-electron/main.js');
    electronApp = await electron.launch({
      args: [mainScript],
      env: { ...process.env, NODE_ENV: 'production' }
    });
    const window = await electronApp.firstWindow();
    editorPage = new EditorPage(window);
    await editorPage.waitForAppLoad();
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test('should switch to configured view mode when opening a file', async () => {
    // 1. Ensure we are in a known state (e.g. Split view, sidebar visible)
    // Default launch is Split. Sidebar might be hidden (default) or toggled.
    // Let's ensure Sidebar is visible to check if it hides.
    if (await editorPage.sidebar.isHidden()) {
      await editorPage.toggleSidebar();
    }
    
    // 2. Simulate opening a file via IPC
    // The default setting for file open is 'preview' (Preview Only)
    // and sidebar should hide.
    await electronApp.evaluate(({ BrowserWindow }) => {
      const win = BrowserWindow.getAllWindows()[0];
      win.webContents.send('file-opened', { 
        content: '# Opened File Content', 
        filePath: '/tmp/test.md' 
      });
    });

    // 3. Verify content
    await expect(editorPage.preview).toContainText('Opened File Content');

    // 4. Verify View Mode -> Preview Only (Editor hidden)
    await expect(editorPage.editor).toBeHidden();
    await expect(editorPage.preview).toBeVisible();

    // 5. Verify Sidebar -> Hidden
    await expect(editorPage.sidebar).toBeHidden();
  });
});
