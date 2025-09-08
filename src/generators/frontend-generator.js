import path from "path";
import {
  ensureDir,
  writeJson,
  mergePackageJson,
  copyTemplates,
  getTemplateDir,
} from "../utils/file-utils.js";
import { FRONTEND_OPTIONS } from "../types.js";

/**
 * Generate frontend structure
 */
export async function generateFrontend(config) {
  const templateDir = getTemplateDir();

  for (const frontend of config.frontend) {
    if (frontend === FRONTEND_OPTIONS.NONE) continue;

    const frontendDir = path.join(config.projectDir, "frontend");
    await ensureDir(frontendDir);

    // Template context
    const context = {
      projectName: config.projectName,
      projectDescription:
        config.description || `A ${frontend} frontend application`,
      frontend: {
        [frontend]: true,
      },
      typescript: config.typescript || false,
      styling: {
        tailwind: config.addons?.includes("tailwind") || false,
        "styled-components":
          config.addons?.includes("styled-components") || false,
        emotion: config.addons?.includes("emotion") || false,
        sass: config.addons?.includes("sass") || false,
      },
      auth: {
        [config.auth]: config.auth !== "none",
      },
      testing: {
        jest: config.addons?.includes("testing"),
        vitest: false,
      },
      useTypeScript: config.typescript || false,
      authorName: config.authorName || "",
      packageManager: {
        [config.packageManager]: true,
      },
    };

    try {
      const frontendTemplateDir = path.join(templateDir, "frontend", frontend);
      await copyTemplates(frontendTemplateDir, frontendDir, context);
    } catch (error) {
      console.warn(
        `Warning: Could not find templates for ${frontend} frontend. Using fallback generation.`,
      );
      await generateFallbackFrontend(config, frontendDir, frontend);
    }
  }
}

async function generateFallbackFrontend(config, frontendDir, frameworkType) {
  await ensureDir(path.join(frontendDir, "src"));
  await ensureDir(path.join(frontendDir, "public"));

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

  await writeJson(path.join(frontendDir, "src", "App.js"), appContent, {
    spaces: 0,
  });
  await writeJson(path.join(frontendDir, "src", "index.js"), indexContent, {
    spaces: 0,
  });
  await writeJson(path.join(frontendDir, "public", "index.html"), htmlContent, {
    spaces: 0,
  });

  // Update package.json
  await mergePackageJson(path.join(config.projectDir, "package.json"), {
    scripts: {
      "dev:frontend": "vite --port 3000",
      "build:frontend": "vite build",
      "preview:frontend": "vite preview",
    },
    dependencies: {
      react: "^18.2.0",
      "react-dom": "^18.2.0",
    },
    devDependencies: {
      "@vitejs/plugin-react": "^4.2.1",
      vite: "^5.0.10",
    },
  });
}

export default generateFrontend;
