/**
 * Helpers for backends that run on the JVM rather than a JavaScript runtime.
 *
 * A Java backend has no package.json, does not belong to the npm workspace, and
 * is built by Maven instead of the selected package manager. Several stages of
 * the generator branch on that distinction, so the checks live in one place.
 */

import type { Backend, ProjectConfig } from "../types.js";

/** Backends generated as Maven projects instead of npm packages. */
export const JAVA_BACKENDS = new Set<string>(["springboot"]);

/** ORMs that are only available on a Java backend. */
export const JAVA_ORMS = new Set<string>(["jpa"]);

/** Auth providers that are only available on a Java backend. */
export const JAVA_AUTH = new Set<string>(["spring-security"]);

/** API styles a Java backend can expose to a JavaScript frontend. */
export const JAVA_COMPATIBLE_APIS = new Set<string>(["none", "rest", "graphql"]);

/** Databases the generated JPA configuration supports. */
export const JPA_DATABASES = new Set<string>(["postgres", "mysql", "sqlite"]);

export function isJavaBackend(backend: Backend | string | undefined): boolean {
  return !!backend && JAVA_BACKENDS.has(backend);
}

/**
 * True when the project has a Java backend and no frontend, meaning nothing in
 * the generated tree is a JavaScript package.
 */
export function isJavaOnlyProject(config: Partial<ProjectConfig>): boolean {
  return (
    isJavaBackend(config.backend) &&
    (!config.frontend || config.frontend === "none")
  );
}
