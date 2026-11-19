/**
 * Submission Builder Script for gta6-trophy-guide-01
 * 
 * Prepares the make.fun competition submission by copying static web assets
 * from `app/` and screenshot captures from `screenshots/` to the output destination
 * (`/output` or `MAKEFUN_OUTPUT_DIR`), then generating the required `dossier.json`
 * using the vendored frontend dossier library.
 */

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildDossier } from './vendor/makefun-frontend.ts';

const baseDir = resolve();
const destinationDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Step 1: Ensure output directory tree exists
mkdirSync(destinationDir, { recursive: true });
mkdirSync(resolve(destinationDir, 'screenshots'), { recursive: true });

// Step 2: Copy static application assets
cpSync(resolve(baseDir, 'app'), resolve(destinationDir, 'app'), { recursive: true });

// Step 3: Copy screenshots if available
const localScreenshotsPath = resolve(baseDir, 'screenshots');
if (existsSync(localScreenshotsPath)) {
  cpSync(localScreenshotsPath, resolve(destinationDir, 'screenshots'), { recursive: true });
}

// Step 4: Generate and write dossier.json using gate configuration caps
const dossierContent = buildDossier(destinationDir, {
  text_max_bytes: 163840,
  screenshots: {
    max: 4,
    max_bytes: 262144,
  },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
});

writeFileSync(resolve(destinationDir, 'dossier.json'), dossierContent);

console.log(`[gta6-trophy-guide-01] Dossier successfully compiled at: ${destinationDir}/dossier.json`);
