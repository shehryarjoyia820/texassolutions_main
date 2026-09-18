/**
 * Static export build for DreamHost shared hosting.
 *
 * Next.js refuses to statically export an app that contains a POST route
 * handler, so this script moves src/app/api aside, runs the export, then puts
 * it back. The PHP endpoint in public/api/submit.php serves the same purpose
 * on DreamHost, and NEXT_PUBLIC_FORM_ENDPOINT points the forms at it.
 *
 *   npm run build:static
 */

import { execSync } from 'node:child_process';
import { existsSync, renameSync, rmSync, cpSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const apiDir = resolve(root, 'src/app/api');
const parked = resolve(root, '.api-parked');

let moved = false;

function restore() {
  if (moved && existsSync(parked)) {
    renameSync(parked, apiDir);
    moved = false;
  }
}

process.on('exit', restore);
process.on('SIGINT', () => {
  restore();
  process.exit(130);
});

try {
  if (existsSync(apiDir)) {
    if (existsSync(parked)) rmSync(parked, { recursive: true, force: true });
    renameSync(apiDir, parked);
    moved = true;
    console.log('• Parked src/app/api for the static export');
  }

  rmSync(resolve(root, 'out'), { recursive: true, force: true });

  execSync('npx next build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      STATIC_EXPORT: '1',
      NEXT_PUBLIC_FORM_ENDPOINT: process.env.NEXT_PUBLIC_FORM_ENDPOINT || '/api/submit.php',
    },
  });

  // Apache configuration for pretty URLs and caching on DreamHost.
  const htaccess = resolve(root, 'deploy/dreamhost/.htaccess');
  if (existsSync(htaccess)) {
    cpSync(htaccess, resolve(root, 'out/.htaccess'));
    console.log('• Copied .htaccess into out/');
  }

  console.log('\n✓ Static site written to ./out — upload its contents to your DreamHost web directory.');
} catch (error) {
  console.error('\n✗ Static export failed');
  console.error(error instanceof Error ? error.message : error);
  restore();
  process.exit(1);
} finally {
  restore();
}
