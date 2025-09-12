import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, Download, GitBranch, Code } from "lucide-react";

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks to get you started quickly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <Code className="h-8 w-8" />
            <span className="text-sm font-medium">New Project</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <Download className="h-8 w-8" />
            <span className="text-sm font-medium">Import Project</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <GitBranch className="h-8 w-8" />
            <span className="text-sm font-medium">Clone Repo</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <Users className="h-8 w-8" />
            <span className="text-sm font-medium">Team Invite</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}