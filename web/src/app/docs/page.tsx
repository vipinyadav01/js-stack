import { redirect } from "next/navigation";

export default function DocsRootPage() {
  // Redirect /docs to /docs/getting-started
  redirect("/docs/getting-started");
}
