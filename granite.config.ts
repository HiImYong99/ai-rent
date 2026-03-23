import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'ai-rent',
  brand: {
    displayName: 'AI 월세',
    primaryColor: '#3182F6',
    icon: 'https://static.toss.im/appsintoss/25373/87dae129-58d7-4cd9-972e-13f988b6ffaa.png',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  permissions: [],
});
