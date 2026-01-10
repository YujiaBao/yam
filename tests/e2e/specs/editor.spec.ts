import { test, expect, _electron as electron, ElectronApplication } from '@playwright/test';
import path from 'path';
import { EditorPage } from '../pages/EditorPage';

test.describe('Editor Workflow', () => {
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

  test('should launch with correct title', async () => {
    expect(await editorPage.page.title()).toBe('yam');
  });

  test('should display editor and preview panes', async () => {
    await expect(editorPage.editor).toBeVisible();
    await expect(editorPage.preview).toBeVisible();
  });

  test('should update preview when typing in editor', async () => {
    await editorPage.typeMarkdown('# Hello POM');
    await expect(editorPage.preview).toContainText('Hello POM');
    await expect(editorPage.preview.locator('h1')).toHaveText('Hello POM');
  });

  test('should toggle sidebar', async () => {
    await expect(editorPage.sidebar).toBeVisible();
    await editorPage.toggleSidebar();
    await expect(editorPage.sidebar).toBeHidden();
    await editorPage.toggleSidebar();
    await expect(editorPage.sidebar).toBeVisible();
  });
});
