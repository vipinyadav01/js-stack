import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
  if (!posthogClient && process.env.POSTHOG_API_KEY) {
    posthogClient = new PostHog(process.env.POSTHOG_API_KEY, {
      host: process.env.POSTHOG_HOST || "https://us.i.posthog.com",
    });
  }
  return posthogClient;
}

export function captureEvent(event: string, properties?: Record<string, any>) {
  const client = getPostHogClient();
  if (client) {
    client.capture({
      distinctId: "cli-user", // You might want to generate a persistent anonymous ID
      event,
      properties,
    });
  }
}

export async function shutdownPostHog() {
  if (posthogClient) {
    await posthogClient.shutdown();
  }
}
