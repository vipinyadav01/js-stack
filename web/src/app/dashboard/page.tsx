import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  Activity, 
  Download, 
  GitBranch, 
  Star, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Code
} from "lucide-react";

export default function Dashboard() {
  // Mock data - in a real app, this would come from your API
  const stats = {
    totalProjects: 42,
    activeProjects: 12,
    totalDownloads: 15420,
    weeklyGrowth: 23.5,
    issues: { open: 3, closed: 27 },
    pullRequests: { open: 2, merged: 15 }
  };

  const recentProjects = [
    { name: "e-commerce-app", status: "active", lastUpdated: "2 hours ago", progress: 85 },
    { name: "blog-platform", status: "completed", lastUpdated: "1 day ago", progress: 100 },
    { name: "dashboard-ui", status: "in-progress", lastUpdated: "3 hours ago", progress: 65 },
    { name: "api-service", status: "planning", lastUpdated: "1 week ago", progress: 25 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "in-progress":
        return <Badge variant="outline">In Progress</Badge>;
      case "planning":
        return <Badge variant="destructive">Planning</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your projects and development activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              +2 new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDownloads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.weeklyGrowth}% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.weeklyGrowth}%</div>
            <p className="text-xs text-muted-foreground">
              Weekly growth rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your latest project activities and progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{project.name}</h4>
                    {getStatusBadge(project.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {project.lastUpdated}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Project Health */}
        <Card>
          <CardHeader>
            <CardTitle>Project Health</CardTitle>
            <CardDescription>
              Issues and pull requests across all projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="issues" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="prs">Pull Requests</TabsTrigger>
              </TabsList>
              
              <TabsContent value="issues" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-4 border rounded-lg">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                    <div>
                      <div className="text-2xl font-bold">{stats.issues.open}</div>
                      <div className="text-sm text-muted-foreground">Open Issues</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-4 border rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <div className="text-2xl font-bold">{stats.issues.closed}</div>
                      <div className="text-sm text-muted-foreground">Closed Issues</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Resolution Rate</span>
                    <span>{Math.round((stats.issues.closed / (stats.issues.open + stats.issues.closed)) * 100)}%</span>
                  </div>
                  <Progress value={Math.round((stats.issues.closed / (stats.issues.open + stats.issues.closed)) * 100)} className="h-2" />
                </div>
              </TabsContent>

              <TabsContent value="prs" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-4 border rounded-lg">
                    <GitBranch className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="text-2xl font-bold">{stats.pullRequests.open}</div>
                      <div className="text-sm text-muted-foreground">Open PRs</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-4 border rounded-lg">
                    <Star className="h-8 w-8 text-green-500" />
                    <div>
                      <div className="text-2xl font-bold">{stats.pullRequests.merged}</div>
                      <div className="text-sm text-muted-foreground">Merged PRs</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Merge Rate</span>
                    <span>{Math.round((stats.pullRequests.merged / (stats.pullRequests.open + stats.pullRequests.merged)) * 100)}%</span>
                  </div>
                  <Progress value={Math.round((stats.pullRequests.merged / (stats.pullRequests.open + stats.pullRequests.merged)) * 100)} className="h-2" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
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
    </div>
  );
}