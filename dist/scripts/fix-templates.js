import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, "../templates/templates");

/**
 * Fix template filename issues
 */
async function fixTemplateFilenames() {
  console.log("🔧 Fixing template filenames...\n");

  const filesToRename = [
    {
      old: "cli/templates/templates/02-frameworks/frontend/nextjs/pages/api/hello.{{#if typescript}}ts{{else}}js{{\if}}.hbs",
      new: "cli/templates/templates/02-frameworks/frontend/nextjs/pages/api/hello.{{#if typescript}}ts{{else}}js{{/if}}.hbs",
    },
    {
      old: "cli/templates/templates/02-frameworks/frontend/react/main.{{#if typescript}}tsx{{else}}jsx{{\if}}.hbs",
      new: "cli/templates/templates/02-frameworks/frontend/react/main.{{#if typescript}}tsx{{else}}jsx{{/if}}.hbs",
    },
    {
      old: "cli/templates/templates/02-frameworks/frontend/vue/main.{{#if typescript}}ts{{else}}js{{\if}}.hbs",
      new: "cli/templates/templates/02-frameworks/frontend/vue/main.{{#if typescript}}ts{{else}}js{{/if}}.hbs",
    },
    {
      old: "cli/templates/templates/02-frameworks/frontend/react-native/App.{{#if useTypeScript}}tsx{{else}}jsx{{\if}}.hbs",
      new: "cli/templates/templates/02-frameworks/frontend/react-native/App.{{#if useTypeScript}}tsx{{else}}jsx{{/if}}.hbs",
    },
    {
      old: "cli/templates/templates/03-integrations/database/sequelize/models.{{#if useTypeScript}}ts{{else}}js{{\if}}.hbs",
      new: "cli/templates/templates/03-integrations/database/sequelize/models.{{#if useTypeScript}}ts{{else}}js{{/if}}.hbs",
    },
    {
      old: "cli/templates/templates/04-features/auth/auth0/config.{{#if typescript}}ts{{else}}js{{\if}}.hbs",
      new: "cli/templates/templates/04-features/auth/auth0/config.{{#if typescript}}ts{{else}}js{{/if}}.hbs",
    },
    {
      old: "cli/templates/templates/04-features/auth/auth0/routes.{{#if typescript}}ts{{else}}js{{\if}}.hbs",
      new: "cli/templates/templates/04-features/auth/auth0/routes.{{#if typescript}}ts{{else}}js{{/if}}.hbs",
    },
    {
      old: "cli/templates/templates/04-features/auth/oauth/routes.{{#if typescript}}ts{{else}}js{{\if}}.hbs",
      new: "cli/templates/templates/04-features/auth/oauth/routes.{{#if typescript}}ts{{else}}js{{/if}}.hbs",
    },
    {
      old: "cli/templates/templates/04-features/auth/frontend/LoginForm.{{#if typescript}}tsx{{else}}jsx{{\if}}.hbs",
      new: "cli/templates/templates/04-features/auth/frontend/LoginForm.{{#if typescript}}tsx{{else}}jsx{{/if}}.hbs",
    },
    {
      old: "cli/templates/templates/05-tooling/testing/vitest/vitest.config.{{#if typescript}}ts{{else}}js{{\if}}.hbs",
      new: "cli/templates/templates/05-tooling/testing/vitest/vitest.config.{{#if typescript}}ts{{else}}js{{/if}}.hbs",
    },
  ];

  let fixedCount = 0;

  for (const { old: oldPath, new: newPath } of filesToRename) {
    const fullOldPath = path.join(__dirname, "..", oldPath);
    const fullNewPath = path.join(__dirname, "..", newPath);

    try {
      if (await fs.pathExists(fullOldPath)) {
        await fs.move(fullOldPath, fullNewPath);
        console.log(`✅ Fixed: ${path.basename(oldPath)}`);
        fixedCount++;
      }
    } catch (error) {
      console.error(`❌ Error fixing ${oldPath}:`, error.message);
    }
  }

  console.log(`\n✨ Fixed ${fixedCount} template filenames\n`);
}

/**
 * Remove TypeScript conditionals and use only JavaScript
 */
async function removeTypeScriptConditionals() {
  console.log("🔄 Removing TypeScript conditionals (JSX only)...\n");

  async function processDirectory(dir) {
    const items = await fs.readdir(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = await fs.stat(itemPath);

      if (stat.isDirectory()) {
        await processDirectory(itemPath);
      } else if (item.endsWith(".hbs")) {
        let content = await fs.readFile(itemPath, "utf8");
        let modified = false;

        // Remove TypeScript conditional blocks and keep only JavaScript
        const typescriptConditionalPattern =
          /\{\{#if\s+(useTypeScript|typescript)\}\}[\s\S]*?\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g;
        if (typescriptConditionalPattern.test(content)) {
          content = content.replace(
            typescriptConditionalPattern,
            (match, p1, p2) => {
              // Keep only the JavaScript part (after {{else}})
              return p2.trim();
            },
          );
          modified = true;
        }

        // Remove standalone TypeScript conditionals
        const tsxPattern =
          /\{\{#if\s+(useTypeScript|typescript)\}\}tsx\{\{else\}\}jsx\{\{\/if\}\}/g;
        if (tsxPattern.test(content)) {
          content = content.replace(tsxPattern, "jsx");
          modified = true;
        }

        const tsPattern =
          /\{\{#if\s+(useTypeScript|typescript)\}\}ts\{\{else\}\}js\{\{\/if\}\}/g;
        if (tsPattern.test(content)) {
          content = content.replace(tsPattern, "js");
          modified = true;
        }

        // Remove TypeScript-specific imports and code
        const tsImportPattern =
          /import\s+type\s+.*?from\s+['"][^'"]+['"];?\n?/g;
        if (tsImportPattern.test(content)) {
          content = content.replace(tsImportPattern, "");
          modified = true;
        }

        const tsTypeAnnotation =
          /:\s*(Request|Response|NextFunction|Express|FastifyRequest|FastifyReply|FastifyInstance)/g;
        if (tsTypeAnnotation.test(content)) {
          content = content.replace(tsTypeAnnotation, "");
          modified = true;
        }

        // Remove TypeScript type assertions
        content = content.replace(/!\s*\./g, ".");
        content = content.replace(/as\s+[A-Z]\w+/g, "");

        if (modified) {
          await fs.writeFile(itemPath, content, "utf8");
          console.log(`✅ Updated: ${path.relative(TEMPLATES_DIR, itemPath)}`);
        }
      }
    }
  }

  await processDirectory(TEMPLATES_DIR);
  console.log("\n✨ TypeScript conditionals removed (JSX only)\n");
}

/**
 * Rename template files to remove TypeScript conditionals
 */
async function renameTemplateFiles() {
  console.log(
    "📝 Renaming template files to remove TypeScript conditionals...\n",
  );

  async function processDirectory(dir) {
    const items = await fs.readdir(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = await fs.stat(itemPath);

      if (stat.isDirectory()) {
        await processDirectory(itemPath);
      } else {
        let newName = item;

        // Replace TypeScript conditional filenames with JavaScript extensions
        newName = newName.replace(
          /\.\{\{#if\s+(useTypeScript|typescript)\}\}tsx\{\{else\}\}jsx\{\{\/if\}\}\.hbs$/,
          ".jsx.hbs",
        );
        newName = newName.replace(
          /\.\{\{#if\s+(useTypeScript|typescript)\}\}ts\{\{else\}\}js\{\{\/if\}\}\.hbs$/,
          ".js.hbs",
        );

        if (newName !== item) {
          const newPath = path.join(dir, newName);
          try {
            await fs.move(itemPath, newPath);
            console.log(
              `✅ Renamed: ${path.relative(TEMPLATES_DIR, itemPath)} -> ${path.relative(TEMPLATES_DIR, newPath)}`,
            );
          } catch (error) {
            console.error(`❌ Error renaming ${item}:`, error.message);
          }
        }
      }
    }
  }

  await processDirectory(TEMPLATES_DIR);
  console.log("\n✨ Template files renamed\n");
}

/**
 * Main execution
 */
async function main() {
  console.log("🚀 Starting template fixes (JSX only)...\n");

  try {
    await renameTemplateFiles();
    await removeTypeScriptConditionals();

    console.log("✅ All template fixes completed successfully!\n");
  } catch (error) {
    console.error("❌ Error during template fixes:", error);
    process.exit(1);
  }
}

main();
