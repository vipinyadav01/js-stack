import path from 'path';
import { ensureDir, writeJson, mergePackageJson } from '../utils/file-utils.js';
import { FRONTEND_OPTIONS } from '../types.js';

/**
 * Generate frontend structure
 */
export async function generateFrontend(config) {
  for (const frontend of config.frontend) {
    if (frontend === FRONTEND_OPTIONS.NONE) continue;
    
    switch (frontend) {
      case FRONTEND_OPTIONS.REACT:
        await generateReactFrontend(config);
        break;
      case FRONTEND_OPTIONS.VUE:
        await generateVueFrontend(config);
        break;
      case FRONTEND_OPTIONS.ANGULAR:
        await generateAngularFrontend(config);
        break;
      case FRONTEND_OPTIONS.SVELTE:
        await generateSvelteFrontend(config);
        break;
      case FRONTEND_OPTIONS.NEXTJS:
        await generateNextFrontend(config);
        break;
      case FRONTEND_OPTIONS.NUXT:
        await generateNuxtFrontend(config);
        break;
      case FRONTEND_OPTIONS.REACT_NATIVE:
        await generateReactNativeFrontend(config);
        break;
    }
  }
}

async function generateReactFrontend(config) {
  const frontendDir = path.join(config.projectDir, 'frontend');
  await ensureDir(frontendDir);
  await ensureDir(path.join(frontendDir, 'src'));
  await ensureDir(path.join(frontendDir, 'public'));
  
  // Create basic React app structure
  const appContent = `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to ${config.projectName}</h1>
        <p>Built with create-js-stack</p>
      </header>
    </div>
  );
}

export default App;
`;

  const indexContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${config.projectName}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`;

  await writeJson(path.join(frontendDir, 'src', 'App.js'), appContent, { spaces: 0 });
  await writeJson(path.join(frontendDir, 'src', 'index.js'), indexContent, { spaces: 0 });
  await writeJson(path.join(frontendDir, 'public', 'index.html'), htmlContent, { spaces: 0 });
  
  // Update package.json
  await mergePackageJson(path.join(config.projectDir, 'package.json'), {
    scripts: {
      'dev:frontend': 'vite --port 3000',
      'build:frontend': 'vite build',
      'preview:frontend': 'vite preview'
    },
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0'
    },
    devDependencies: {
      '@vitejs/plugin-react': '^4.2.1',
      'vite': '^5.0.10'
    }
  });
}

async function generateVueFrontend(config) {
  // Stub for Vue
  const frontendDir = path.join(config.projectDir, 'frontend-vue');
  await ensureDir(frontendDir);
}

async function generateAngularFrontend(config) {
  // Stub for Angular
  const frontendDir = path.join(config.projectDir, 'frontend-angular');
  await ensureDir(frontendDir);
}

async function generateSvelteFrontend(config) {
  // Stub for Svelte
  const frontendDir = path.join(config.projectDir, 'frontend-svelte');
  await ensureDir(frontendDir);
}

async function generateNextFrontend(config) {
  // Stub for Next.js
  const frontendDir = path.join(config.projectDir, 'frontend-next');
  await ensureDir(frontendDir);
}

async function generateNuxtFrontend(config) {
  // Stub for Nuxt
  const frontendDir = path.join(config.projectDir, 'frontend-nuxt');
  await ensureDir(frontendDir);
}

async function generateReactNativeFrontend(config) {
  // Stub for React Native
  const mobileDir = path.join(config.projectDir, 'mobile');
  await ensureDir(mobileDir);
}

export default { generateFrontend };
