/**
 * Submission Builder Script for gta6-trophy-guide-01
 * 
 * Prepares the make.fun competition submission by copying static web assets
 * from `app/` and screenshot captures from `screenshots/` to the output destination
 * (`/output` or `MAKEFUN_OUTPUT_DIR`), then generating the required `dossier.json`
 * using the vendored frontend dossier library.
 */

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const baseDir = dirname(fileURLToPath(import.meta.url));
if (process.env.MAKEFUN_OUTPUT_DIR !== undefined && !isAbsolute(process.env.MAKEFUN_OUTPUT_DIR)) {
  throw new Error(`MAKEFUN_OUTPUT_DIR must be an absolute path, got: ${process.env.MAKEFUN_OUTPUT_DIR}`);
}
const destinationDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
console.log(`[gta6-trophy-guide-01] baseDir: ${baseDir}, destinationDir: ${destinationDir}`);

// Step 1: Ensure output directory tree exists
mkdirSync(destinationDir, { recursive: true });
mkdirSync(resolve(destinationDir, 'screenshots'), { recursive: true });

// Step 2: Copy static application assets
const appPath = resolve(baseDir, 'app');
if (!existsSync(appPath)) {
  throw new Error(`Missing required application directory at: ${appPath}`);
}
cpSync(appPath, resolve(destinationDir, 'app'), { recursive: true });

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
