export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Server-side initialization if needed (posthog-node)
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // Edge-side initialization
  }
}
