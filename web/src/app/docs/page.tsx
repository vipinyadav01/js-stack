export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-mono mb-4">
          JS-Stack Documentation
        </h1>
        <p className="text-lg text-muted-foreground">
          A comprehensive CLI tool for scaffolding production-ready JavaScript
          and TypeScript full-stack applications.
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Quick Start</h2>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <pre className="text-sm font-mono">
              <code>npx create-js-stack@latest my-app</code>
            </pre>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            This will start the interactive setup process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Examples</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">React + Express + PostgreSQL</h3>
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <pre className="text-sm font-mono">
                  <code>
                    npx create-js-stack@latest my-app --frontend react --backend
                    express --database postgres --orm prisma
                  </code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Next.js Full-Stack</h3>
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <pre className="text-sm font-mono">
                  <code>
                    npx create-js-stack@latest my-app --frontend nextjs
                    --database postgres --orm prisma --auth nextauth
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Available Technologies
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Frontend</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>• React (Vite)</div>
                <div>• Next.js</div>
                <div>• Vue.js</div>
                <div>• Svelte</div>
                <div>• Angular</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Backend</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>• Express.js</div>
                <div>• Fastify</div>
                <div>• NestJS</div>
                <div>• Koa.js</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Database</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>• PostgreSQL</div>
                <div>• MongoDB</div>
                <div>• MySQL</div>
                <div>• SQLite</div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Command Options</h2>
          <div className="grid gap-3">
            <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card">
              <code className="bg-primary/10 text-primary px-3 py-1 rounded font-mono text-sm">
                --frontend
              </code>
              <span className="text-sm text-muted-foreground">
                Choose frontend framework
              </span>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card">
              <code className="bg-primary/10 text-primary px-3 py-1 rounded font-mono text-sm">
                --backend
              </code>
              <span className="text-sm text-muted-foreground">
                Choose backend framework
              </span>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card">
              <code className="bg-primary/10 text-primary px-3 py-1 rounded font-mono text-sm">
                --database
              </code>
              <span className="text-sm text-muted-foreground">
                Choose database system
              </span>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card">
              <code className="bg-primary/10 text-primary px-3 py-1 rounded font-mono text-sm">
                --preset saas
              </code>
              <span className="text-sm text-muted-foreground">
                Use SaaS application preset
              </span>
            </div>
          </div>
        </section>

        <section className="text-center py-8 border-t border-border">
          <h2 className="text-2xl font-bold font-mono text-foreground mb-4">
            Ready to Build?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start creating your next JavaScript project with our interactive
            Stack Builder.
          </p>
          <a
            href="/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try Stack Builder →
          </a>
        </section>
      </div>
    </div>
  );
}
