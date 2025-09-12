import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { CheckCircle, Zap, Settings, Plus } from 'lucide-react'

export default function ProjectInt() {
  return (
    <>
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Getting Started</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create new projects or add features to existing ones with create-js-stack CLI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Create New Project</CardTitle>
                  <CardDescription>
                    Start fresh with modern full-stack templates
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
                <div className="text-muted-foreground"># Interactive setup</div>
                <div className="text-foreground">npx create-js-stack init my-app</div>
                <div className="text-muted-foreground mt-3"># Quick start with defaults</div>
                <div className="text-foreground">npx create-js-stack init my-app --yes</div>
                <div className="text-muted-foreground mt-3"># Use preset template</div>
                <div className="text-foreground">npx create-js-stack init --preset saas</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">React + Express</Badge>
                <Badge variant="outline">TypeScript</Badge>
                <Badge variant="outline">Database</Badge>
                <Badge variant="outline">Authentication</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Plus className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <CardTitle>Add Features</CardTitle>
                  <CardDescription>
                    Enhance existing projects with new capabilities
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
                <div className="text-muted-foreground"># Add authentication</div>
                <div className="text-foreground">npx create-js-stack add auth</div>
                <div className="text-muted-foreground mt-3"># Add database setup</div>
                <div className="text-foreground">npx create-js-stack add database</div>
                <div className="text-muted-foreground mt-3"># Add testing framework</div>
                <div className="text-foreground">npx create-js-stack add testing</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">JWT Auth</Badge>
                <Badge variant="outline">Prisma</Badge>
                <Badge variant="outline">Jest</Badge>
                <Badge variant="outline">Docker</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Usage Section */}
        <div className="mt-12">
          <div className="text-center space-y-4 mb-8">
            <h3 className="text-2xl font-bold">Advanced Usage</h3>
            <p className="text-muted-foreground">
              Explore all available options and customize your setup
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Browse Options</CardTitle>
                <CardDescription>
                  See all available frameworks and tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  npx create-js-stack list
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Custom Configuration</CardTitle>
                <CardDescription>
                  Specify exact technologies you want
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded font-mono text-sm space-y-1">
                  <div>npx create-js-stack init my-app \</div>
                  <div>  --frontend react \</div>
                  <div>  --backend express \</div>
                  <div>  --database postgres</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">View Documentation</CardTitle>
                <CardDescription>
                  Get help and detailed guides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  npx create-js-stack docs
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center space-y-6 py-8">
          <div className="flex justify-center gap-4">
            <Button size="lg" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Try Interactive Mode
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Settings className="w-4 h-4" />
              View All Options
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
