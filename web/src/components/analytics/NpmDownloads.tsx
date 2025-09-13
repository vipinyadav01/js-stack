import { Download, Package, AlertCircle } from "lucide-react";
import { NpmPackageData } from "@/lib/api";

export default function NpmDownloads({ npmData, error }: { npmData: NpmPackageData | null, error: string }) {
  const hasError = error && error.includes("npm downloads API error: 404");
  const downloadCount = npmData?.totalLast7Days || 0;
  
  return (
    <div className="flex h-full flex-col justify-between rounded border border-border p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">NPM_DOWNLOADS</span>
        </div>
        <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
          7 DAYS
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded border border-border p-3">
          <div className="flex items-center gap-2 text-sm">
            {hasError ? (
              <>
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-destructive">Package not found on npm</span>
              </>
            ) : npmData ? (
              <>
                <Package className="h-4 w-4 text-primary" />
                <span className="text-foreground font-mono text-lg font-bold">
                  {downloadCount.toLocaleString()}
                </span>
              </>
            ) : (
              <>
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">No data available</span>
              </>
            )}
          </div>
          <div className={`rounded border border-border px-2 py-1 text-xs ${
            hasError 
              ? "bg-destructive/10 text-destructive" 
              : npmData 
              ? "bg-green-500/10 text-green-600" 
              : "bg-muted/30"
          }`}>
            {hasError ? "ERROR" : npmData ? "ACTIVE" : "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}