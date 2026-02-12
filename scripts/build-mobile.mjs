/**
 * Mobile build script for Capacitor.
 *
 * Next.js static export (output: 'export') does not support middleware.
 * This script temporarily moves the middleware file out of the way,
 * runs the static build, then restores it.
 */
import { renameSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const root = process.cwd();
const middlewareSrc = join(root, 'src', 'middleware.ts');
const middlewareBak = join(root, 'src', 'middleware.ts.bak');

let middlewareMoved = false;

function moveMiddleware() {
  if (existsSync(middlewareSrc)) {
    renameSync(middlewareSrc, middlewareBak);
    middlewareMoved = true;
    console.log('📦 Temporarily moved middleware.ts for static export');
  }
}

function restoreMiddleware() {
  if (middlewareMoved && existsSync(middlewareBak)) {
    renameSync(middlewareBak, middlewareSrc);
    console.log('✅ Restored middleware.ts');
  }
}

function run(cmd) {
  console.log(`\n🔧 Running: ${cmd}\n`);
  execSync(cmd, { stdio: 'inherit', env: { ...process.env, BUILD_TARGET: 'mobile' } });
}

try {
  // Step 1: Move middleware out of the way
  moveMiddleware();

  // Step 2: Build Next.js static export
  run('npx next build');

  // Step 3: Restore middleware
  restoreMiddleware();

  // Step 4: Create redirect index.html
  run('node scripts/post-build.mjs');

  // Step 5: Sync with Capacitor
  run('npx cap sync');

  console.log('\n🎉 Mobile build complete!');
  console.log('   Run "npm run open:android" to open in Android Studio');
  console.log('   Run "npm run open:ios" to open in Xcode\n');
} catch (error) {
  // Always restore middleware even if build fails
  restoreMiddleware();
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
