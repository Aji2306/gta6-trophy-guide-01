import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

mkdirSync('screenshots', { recursive: true });

// Start server
const server = spawn('node', ['serve.ts', '--port', '8085'], { stdio: 'inherit' });
await new Promise(resolve => setTimeout(resolve, 1500));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

try {
  // 1. Checklist with guide pane open, progress & filters visible
  await page.goto('http://localhost:8085');
  await page.evaluate(() => {
    localStorage.setItem('gta6-trophy-checklist', JSON.stringify([1, 2, 3, 4, 8, 9, 10, 15, 16, 20, 21, 35, 44]));
  });
  await page.reload();
  await page.waitForSelector('#rows tr');
  // Click second row to ensure guide pane is open
  await page.click('#rows tr:nth-child(2)');
  await page.screenshot({ path: 'screenshots/1-checklist.jpg', type: 'jpeg', quality: 82 });
  console.log('Took 1-checklist.jpg');

  // 2. Roadmap view
  await page.click('button[data-target="roadmap-tab"]');
  await page.waitForSelector('#roadmap-tab.active');
  await page.screenshot({ path: 'screenshots/2-roadmap.jpg', type: 'jpeg', quality: 82 });
  console.log('Took 2-roadmap.jpg');

  // 3. Missables view with spoiler setting ON
  await page.click('button[data-target="checklist-tab"]');
  await page.click('#spoiler-toggle');
  await page.click('button[data-target="missables-tab"]');
  await page.waitForSelector('#missables-tab.active');
  await page.screenshot({ path: 'screenshots/3-missables.jpg', type: 'jpeg', quality: 82 });
  console.log('Took 3-missables.jpg');

  // 4. Filtered view (collectibles) with export/import controls visible
  await page.click('button[data-target="checklist-tab"]');
  await page.selectOption('#filter-kind', 'collectibles');
  await page.waitForSelector('#rows tr');
  await page.screenshot({ path: 'screenshots/4-collectibles.jpg', type: 'jpeg', quality: 82 });
  console.log('Took 4-collectibles.jpg');

} finally {
  await browser.close();
  server.kill();
}
