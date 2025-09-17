/**
 * Plugin module exports
 * All available plugins for the generator system
 */

export { default as PackageJsonPlugin } from "./PackageJsonPlugin.js";
export { default as FilePlugin } from "./FilePlugin.js";
export { default as DependencyPlugin } from "./DependencyPlugin.js";
export { default as AdvancedDependencyResolver } from "./AdvancedDependencyResolver.js";
export { default as AnalyticsPlugin } from "./AnalyticsPlugin.js";
export { default as ReadmePlugin } from "./ReadmePlugin.js";
export { default as EntryPointPlugin } from "./EntryPointPlugin.js";

export default {
  PackageJsonPlugin,
  FilePlugin,
  DependencyPlugin,
  AdvancedDependencyResolver,
  AnalyticsPlugin,
  ReadmePlugin,
  EntryPointPlugin,
};
