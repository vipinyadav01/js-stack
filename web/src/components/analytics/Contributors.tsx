import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { GitHubRepoData } from "@/lib/api";

export default function Contributors({ contributors }: { contributors: GitHubRepoData["contributors"] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contributors</CardTitle>
        <CardDescription>Project contributors</CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          {contributors?.length ? (
            contributors.map((c) => (
              <li key={c.login} className="flex items-center gap-2 py-1">
                <Image src={c.avatarUrl} alt={c.login} width={24} height={24} className="rounded-full" />
                <span>{c.login}</span>
              </li>
            ))
          ) : (
            <li>No contributors found.</li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}