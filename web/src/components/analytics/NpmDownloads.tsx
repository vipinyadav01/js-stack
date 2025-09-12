import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { NpmPackageData } from "@/lib/api";

export default function NpmDownloads({ npmData, error }: { npmData: NpmPackageData | null, error: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>NPM Downloads</CardTitle>
        <CardDescription>Last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {error && error.includes("npm downloads API error: 404")
            ? "Package not found on npm."
            : npmData
            ? npmData.totalLast7Days.toLocaleString()
            : "No data"}
        </div>
      </CardContent>
    </Card>
  );
}