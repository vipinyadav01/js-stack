import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { GitHubRepoData } from "@/lib/api";

export default function RepoInfo({ info }: { info: GitHubRepoData["info"] | undefined }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Repo Info</CardTitle>
        <CardDescription>Repository details</CardDescription>
      </CardHeader>
      <CardContent>
        {info ? (
          <ul>
            <li><strong>Name:</strong> {info.name}</li>
            <li><strong>Description:</strong> {info.description}</li>
            <li><strong>Stars:</strong> {info.stargazersCount}</li>
            <li><strong>Forks:</strong> {info.forksCount}</li>
            <li><strong>Open Issues:</strong> {info.openIssuesCount}</li>
            <li><strong>Language:</strong> {info.language}</li>
            <li><strong>License:</strong> {info.license?.name || "None"}</li>
          </ul>
        ) : (
          <div>No repo info found.</div>
        )}
      </CardContent>
    </Card>
  );
}