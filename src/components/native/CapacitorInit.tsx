'use client';

import { useEffect } from 'react';

/**
 * Initializes Capacitor native plugins when running as a native app.
 * This component should be rendered once in the app layout.
 * It gracefully falls back to no-op when running in a browser.
 */
export function CapacitorInit() {
  useEffect(() => {
    async function initNative() {
      try {
        // Dynamically import to avoid issues in web-only builds
        const { Capacitor } = await import('@capacitor/core');

        if (!Capacitor.isNativePlatform()) return;

        // Hide splash screen after app is ready
        const { SplashScreen } = await import('@capacitor/splash-screen');
        await SplashScreen.hide({ fadeOutDuration: 300 });

        // Configure status bar
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#0f0b2e' });

        // Configure keyboard
        const { Keyboard } = await import('@capacitor/keyboard');
        Keyboard.addListener('keyboardWillShow', () => {
          document.body.classList.add('keyboard-open');
        });
        Keyboard.addListener('keyboardWillHide', () => {
          document.body.classList.remove('keyboard-open');
        });
      } catch {
        // Not running in Capacitor — no-op
      }
    }

    initNative();
  }, []);

  return null;
}
