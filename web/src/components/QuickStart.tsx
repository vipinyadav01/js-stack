import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuickStart() {
  return (
    <>
          <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Essential Commands</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Common commands to boost your development productivity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Initialize Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted p-3 rounded font-mono text-sm">
                npx create-js-stack init my-app
              </div>
              <p className="text-sm text-muted-foreground">
                Create a new full-stack JavaScript project
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted p-3 rounded font-mono text-sm">
                npx create-js-stack init my-app --yes
              </div>
              <p className="text-sm text-muted-foreground">
                Use default configuration for quick setup
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Browse Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted p-3 rounded font-mono text-sm">
                npx create-js-stack list
              </div>
              <p className="text-sm text-muted-foreground">
                View available frameworks and tools
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
