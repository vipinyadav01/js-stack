import { Users, Download, GitBranch, Code, Zap } from "lucide-react";

export default function QuickActions() {
  const actions = [
    { icon: Code, label: "NEW_PROJECT", status: "CREATE", command: "npx create-js-stack init" },
    { icon: Download, label: "IMPORT_PROJECT", status: "IMPORT", command: "git clone <repo>" },
    { icon: GitBranch, label: "CLONE_REPO", status: "CLONE", command: "git clone <url>" },
    { icon: Users, label: "TEAM_INVITE", status: "INVITE", command: "gh repo invite" }
  ];

  return (
    <div className="flex h-full flex-col justify-between rounded border border-border p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">QUICK_ACTIONS</span>
        </div>
        <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
          {actions.length}
        </div>
      </div>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <div key={index} className="group flex items-center justify-between rounded border border-border p-3 transition-colors hover:bg-muted/10 cursor-pointer">
            <div className="flex items-center gap-2 text-sm">
              <action.icon className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
              <span className="text-foreground font-mono">{action.label}</span>
            </div>
            <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
              {action.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}