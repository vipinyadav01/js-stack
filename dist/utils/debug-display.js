import chalk from "chalk";

/**
 * Display enhanced debug information in a readable format
 */
export function displayDebugInfo(projectName, options) {
  console.log("\n" + chalk.blue.bold("📋 Debug Information:"));
  console.log(chalk.gray("═".repeat(60)));

  // Project details
  console.log(chalk.cyan.bold("🏗️  Project Details:"));
  console.log(
    chalk.gray("   Name:"),
    chalk.white(projectName || "Not specified"),
  );
  console.log(
    chalk.gray("   Directory:"),
    chalk.yellow(
      projectName ? `${process.cwd()}/${projectName}` : "Not specified",
    ),
  );

  // Technology stack
  console.log(chalk.cyan.bold("\n🚀 Technology Stack:"));
  if (options.frontend && options.frontend.length > 0) {
    console.log(
      chalk.gray("   Frontend:"),
      chalk.green(options.frontend.join(", ")),
    );
  } else {
    console.log(chalk.gray("   Frontend:"), chalk.gray("none"));
  }

  if (options.backend && options.backend !== "none") {
    console.log(chalk.gray("   Backend:"), chalk.green(options.backend));
  } else {
    console.log(chalk.gray("   Backend:"), chalk.gray("none"));
  }

  if (options.database && options.database !== "none") {
    console.log(chalk.gray("   Database:"), chalk.green(options.database));
  } else {
    console.log(chalk.gray("   Database:"), chalk.gray("none"));
  }

  if (options.orm && options.orm !== "none") {
    console.log(chalk.gray("   ORM:"), chalk.green(options.orm));
  } else {
    console.log(chalk.gray("   ORM:"), chalk.gray("none"));
  }

  if (options.auth && options.auth !== "none") {
    console.log(chalk.gray("   Auth:"), chalk.green(options.auth));
  } else {
    console.log(chalk.gray("   Auth:"), chalk.gray("none"));
  }

  if (options.addons && options.addons.length > 0) {
    console.log(
      chalk.gray("   Addons:"),
      chalk.green(options.addons.join(", ")),
    );
  } else {
    console.log(chalk.gray("   Addons:"), chalk.gray("none"));
  }

  // Setup options
  console.log(chalk.cyan.bold("\n⚙️  Setup Options:"));
  console.log(
    chalk.gray("   Package Manager:"),
    chalk.green(options.packageManager || "npm"),
  );
  console.log(
    chalk.gray("   Git Repository:"),
    chalk.green(options.git !== false ? "Yes" : "No"),
  );
  console.log(
    chalk.gray("   Install Dependencies:"),
    chalk.green(options.install !== false ? "Yes" : "No"),
  );
  console.log(
    chalk.gray("   Non-interactive:"),
    chalk.green(options.yes ? "Yes (--yes)" : "No"),
  );

  // System information
  console.log(chalk.cyan.bold("\n🖥️  System Information:"));
  console.log(chalk.gray("   Node Version:"), chalk.green(process.version));
  console.log(chalk.gray("   Working Directory:"), chalk.yellow(process.cwd()));
  console.log(
    chalk.gray("   Platform:"),
    chalk.green(`${process.platform} ${process.arch}`),
  );

  console.log(chalk.gray("═".repeat(60)));
  console.log();
}

/**
 * Display enhanced result information in a readable format
 */
export function displayResultInfo(result) {
  console.log("\n" + chalk.blue.bold("🔍 Result Information:"));
  console.log(chalk.gray("─".repeat(50)));

  // Show project details
  if (result.result?.result) {
    const projectData = result.result.result;
    console.log(
      chalk.cyan("📁 Project Directory:") + ` ${projectData.projectDir}`,
    );
    console.log(
      chalk.cyan("📄 Files Created:") +
        ` ${projectData.processedFiles?.length || 0}`,
    );

    if (projectData.processedFiles?.length > 0) {
      console.log(chalk.gray("   Files:"));
      projectData.processedFiles.slice(0, 5).forEach((file) => {
        const relativePath = file
          .replace(projectData.projectDir, "")
          .substring(1);
        console.log(chalk.gray(`   • ${relativePath}`));
      });
      if (projectData.processedFiles.length > 5) {
        console.log(
          chalk.gray(
            `   ... and ${projectData.processedFiles.length - 5} more files`,
          ),
        );
      }
    }
  }

  // Show health check summary
  if (result.health) {
    const health = result.health;
    console.log(chalk.cyan("🏥 Health Check Summary:"));
    console.log(chalk.green(`   ✅ Passed: ${health.passed}`));
    console.log(chalk.yellow(`   ⚠️  Warnings: ${health.warnings}`));
    console.log(chalk.red(`   ❌ Failed: ${health.failed}`));
    console.log(
      chalk.blue(`   📊 Success Rate: ${health.summary?.successRate || 0}%`),
    );
  }

  // Show performance data
  if (result.performance) {
    const perf = result.performance;
    console.log(chalk.cyan("⚡ Performance:"));
    console.log(chalk.gray(`   Total Time: ${perf.totalDuration}ms`));
    console.log(chalk.gray(`   Operations: ${perf.operationCount || 0}`));
  }

  console.log(chalk.gray("─".repeat(50)));
}

export default {
  displayDebugInfo,
  displayResultInfo,
};
