import { test, expect, _electron as electron, ElectronApplication } from '@playwright/test';
import path from 'path';
import { EditorPage } from '../pages/EditorPage';

test.describe('Editor Workflow', () => {
  let electronApp: ElectronApplication;
  let editorPage: EditorPage;

  test.beforeAll(async () => {
    const mainScript = path.join(__dirname, '../../../../dist-electron/main.js');
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
    const title = await editorPage.page.title();
    expect(title).toContain('Yam');
  });

  test('should display split view by default', async () => {
    await expect(editorPage.preview).toBeVisible();
    await expect(editorPage.editor).toBeVisible();
  });

  test('should update preview when typing in editor', async () => {
    await editorPage.typeMarkdown('# Hello POM');
    await expect(editorPage.preview).toContainText('Hello POM');
    await expect(editorPage.preview.locator('h1')).toHaveText('Hello POM');
  });

  test('should show toolbar with view mode buttons', async () => {
    await expect(editorPage.page.locator('button[title="Editor"]')).toBeVisible();
    await expect(editorPage.page.locator('button[title="Split"]')).toBeVisible();
    await expect(editorPage.page.locator('button[title="Preview"]')).toBeVisible();
  });
});
