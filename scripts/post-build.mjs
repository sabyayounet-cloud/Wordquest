/**
 * Post-build script for mobile builds.
 * Creates a redirect index.html at the root of the static export
 * so Capacitor knows where to route when the app first opens.
 */
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const outDir = join(process.cwd(), 'out');

if (!existsSync(outDir)) {
  console.error('Error: out/ directory does not exist. Run "next build" first.');
  process.exit(1);
}

const redirectHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>WordQuest</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f0b2e 0%, #1a1145 50%, #2d1b69 100%);
      font-family: 'Nunito', system-ui, sans-serif;
    }
    .loader {
      text-align: center;
      color: white;
    }
    .loader .icon {
      font-size: 5rem;
      animation: float 2s ease-in-out infinite;
    }
    .loader .title {
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(to right, #a78bfa, #f472b6, #facc15);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-top: 0.5rem;
    }
    .loader .subtitle {
      font-size: 0.875rem;
      color: rgba(255,255,255,0.5);
      margin-top: 0.5rem;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
  </style>
  <script>
    (function() {
      try {
        var saved = localStorage.getItem('wordquest_state');
        var locale = 'en';
        if (saved) {
          var state = JSON.parse(saved);
          if (state.profile && state.profile.uiLanguage) {
            var valid = ['en', 'de', 'nl'];
            if (valid.indexOf(state.profile.uiLanguage) !== -1) {
              locale = state.profile.uiLanguage;
            }
          }
        }
        window.location.replace('/' + locale + '/');
      } catch(e) {
        window.location.replace('/en/');
      }
    })();
  </script>
  <noscript>
    <meta http-equiv="refresh" content="0;url=/en/">
  </noscript>
</head>
<body>
  <div class="loader">
    <div class="icon">🏰</div>
    <div class="title">WordQuest</div>
    <div class="subtitle">Loading your adventure...</div>
  </div>
</body>
</html>`;

const indexPath = join(outDir, 'index.html');
writeFileSync(indexPath, redirectHtml, 'utf-8');
console.log('✅ Created redirect index.html in out/');
