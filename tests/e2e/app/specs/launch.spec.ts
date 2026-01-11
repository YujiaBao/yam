import { test, expect, _electron as electron } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { EditorPage } from '../pages/EditorPage';

test.describe('App Launch', () => {
  const testFile = path.join(__dirname, 'launch-test.md');
  const testContent = 'Content from File';

  test.beforeAll(() => {
    fs.writeFileSync(testFile, testContent);
  });

  test.afterAll(() => {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  test('should load file content when launched with a file argument', async () => {
    const mainScript = path.join(__dirname, '../../../../dist-electron/main.js');
    
    const electronApp = await electron.launch({
      args: [mainScript, testFile],
      env: { ...process.env, NODE_ENV: 'production' }
    });

    const window = await electronApp.firstWindow();
    const editorPage = new EditorPage(window);

    // Wait for the app to settle
    await window.waitForTimeout(1000);

    const previewText = await editorPage.getPreviewText();
    expect(previewText.toLowerCase()).toContain(testContent.toLowerCase());
    
    await electronApp.close();
  });

  test('should load default content when launched without arguments', async () => {
    const mainScript = path.join(__dirname, '../../../../dist-electron/main.js');
    
    const electronApp = await electron.launch({
      args: [mainScript],
      env: { ...process.env, NODE_ENV: 'production' }
    });

    const window = await electronApp.firstWindow();
    const editorPage = new EditorPage(window);

    await editorPage.waitForAppLoad();
    
    const previewText = await editorPage.getPreviewText();
    expect(previewText.toLowerCase()).toContain('welcome to yam');
    
    await electronApp.close();
  });
});
