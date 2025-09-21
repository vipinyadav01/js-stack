import React from 'react'
import { Badge } from './ui/badge'
import { CheckCircle, Zap, Settings, Plus, Terminal, FileText, Code } from 'lucide-react'

export default function ProjectInt() {
  return (
    <>
      <section className="space-y-8">
        <div className="mb-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg sm:text-xl">
                GETTING_STARTED.TXT
              </span>
            </div>
            <div className="hidden h-px flex-1 bg-border sm:block" />
            <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
              [CLI COMMANDS]
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded border border-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">CREATE_PROJECT</span>
              </div>
              <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                NEW
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span className="text-primary">$</span>
                    <span className="text-foreground">
                      npx create-js-stack init my-app
                    </span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    INTERACTIVE
                  </div>
                </div>
              </div>
              
              <div className="rounded border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span className="text-primary">$</span>
                    <span className="text-foreground">
                      npx create-js-stack init my-app --yes
                    </span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    QUICK
                  </div>
                </div>
              </div>

              <div className="rounded border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span className="text-primary">$</span>
                    <span className="text-foreground">
                      npx create-js-stack init --preset saas
                    </span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    PRESET
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">React + Express</Badge>
              <Badge variant="outline" className="text-xs">TypeScript</Badge>
              <Badge variant="outline" className="text-xs">Database</Badge>
              <Badge variant="outline" className="text-xs">Auth</Badge>
            </div>
          </div>

          <div className="rounded border border-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">ADD_FEATURES</span>
              </div>
              <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                ENHANCE
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span className="text-primary">$</span>
                    <span className="text-foreground">
                      npx create-js-stack add auth
                    </span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    AUTH
                  </div>
                </div>
              </div>
              
              <div className="rounded border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span className="text-primary">$</span>
                    <span className="text-foreground">
                      npx create-js-stack add database
                    </span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    DB
                  </div>
                </div>
              </div>

              <div className="rounded border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span className="text-primary">$</span>
                    <span className="text-foreground">
                      npx create-js-stack add testing
                    </span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    TEST
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">JWT Auth</Badge>
              <Badge variant="outline" className="text-xs">Prisma</Badge>
              <Badge variant="outline" className="text-xs">Jest</Badge>
              <Badge variant="outline" className="text-xs">Docker</Badge>
            </div>
          </div>
        </div>

        {/* Advanced Usage Section */}
        <div className="mt-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg sm:text-xl">
                ADVANCED_USAGE.TXT
              </span>
            </div>
            <div className="hidden h-px flex-1 bg-border sm:block" />
            <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
              [ADVANCED COMMANDS]
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">BROWSE_OPTIONS</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  LIST
                </div>
              </div>

              <div className="rounded border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span className="text-primary">$</span>
                    <span className="text-foreground">
                      npx create-js-stack list
                    </span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    INFO
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">CUSTOM_CONFIG</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  SPECIFY
                </div>
              </div>

              <div className="rounded border border-border p-3">
                <div className="flex items-center gap-2 font-mono text-sm mb-2">
                  <span className="text-primary">$</span>
                  <span className="text-foreground">
                    npx create-js-stack init my-app \
                  </span>
                </div>
                <div className="font-mono text-xs text-muted-foreground space-y-1 ml-4">
                  <div>--frontend react \</div>
                  <div>--backend express \</div>
                  <div>--database postgres</div>
                </div>
              </div>
            </div>

            <div className="rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">VIEW_DOCS</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  HELP
                </div>
              </div>

              <div className="rounded border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span className="text-primary">$</span>
                    <span className="text-foreground">
                      npx create-js-stack docs
                    </span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    GUIDE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg sm:text-xl">
                QUICK_ACTIONS.TXT
              </span>
            </div>
            <div className="hidden h-px flex-1 bg-border sm:block" />
            <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
              [GET STARTED]
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="group cursor-pointer rounded border border-border p-4 transition-colors hover:bg-muted/10">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                  <span className="font-semibold text-sm">TRY_INTERACTIVE</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  START
                </div>
              </div>

              <div className="rounded border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-foreground">Try interactive mode</span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    LAUNCH
                  </div>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer rounded border border-border p-4 transition-colors hover:bg-muted/10">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                  <span className="font-semibold text-sm">VIEW_OPTIONS</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  EXPLORE
                </div>
              </div>

              <div className="rounded border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Settings className="h-4 w-4 text-primary" />
                    <span className="text-foreground">View all available options</span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    BROWSE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
