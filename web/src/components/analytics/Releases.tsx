import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { GitHubRepoData } from "@/lib/api";

export default function Releases({ releases }: { releases: GitHubRepoData["releases"] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Releases</CardTitle>
        <CardDescription>Latest project releases</CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          {releases?.length ? (
            releases.map((r) => (
              <li key={r.tagName} className="py-1">
                <a href={r.htmlUrl} target="_blank" rel="noopener" className="text-blue-600 underline">{r.name || r.tagName}</a>
              </li>
            ))
          ) : (
            <li>No releases found.</li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}