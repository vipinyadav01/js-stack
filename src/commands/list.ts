import chalk from "chalk";

export async function listPresets(options: any) {
  console.log(chalk.blue("Available presets:"));
  console.log(chalk.green("- mern"));
  console.log(chalk.green("- next-fullstack"));
  console.log(chalk.green("- react-vite"));
  console.log(chalk.green("- express-api"));

  if (options.json) {
    console.log(
      JSON.stringify(
        ["mern", "next-fullstack", "react-vite", "express-api"],
        null,
        2,
      ),
    );
  }
}
