import NpmVersion from "@/components/NpmVersion";
import { Terminal, Package, Github } from "lucide-react";

export default function Hero() {
  return (
    <div className="w-full max-w-full overflow-hidden px-4">
      <main className="mx-auto max-w-[1280px]">
        <div className="mb-8">
          <div className="overflow-hidden rounded-lg border border-border bg-card/60 shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                </div>
                <div className="ml-2 flex items-center gap-2 text-muted-foreground text-xs">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Display</span>
                </div>
              </div>
            </div>
            <div className="p-6 backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 w-full">
                <pre className="ascii-art text-primary text-[0.5rem] sm:text-[0.6rem] md:text-xs lg:text-sm xl:text-base leading-tight overflow-x-auto max-w-full whitespace-pre-wrap break-words font-mono">
                  {` ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗
██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝
██║     ██████╔╝█████╗  ███████║   ██║   █████╗  
██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝  
╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗
 ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝`}
                </pre>

                <pre className="ascii-art text-primary text-[0.5rem] sm:text-[0.6rem] md:text-xs lg:text-sm xl:text-base leading-tight overflow-x-auto max-w-full whitespace-pre-wrap break-words font-mono">
                  {`     ██╗███████╗
     ██║██╔════╝
     ██║███████╗
██   ██║╚════██║
╚█████╔╝███████║
 ╚════╝ ╚══════╝`}
                </pre>

                <pre className="ascii-art text-primary text-[0.5rem] sm:text-[0.6rem] md:text-xs lg:text-sm xl:text-base leading-tight overflow-x-auto max-w-full whitespace-pre-wrap break-words font-mono">
                  {`███████╗████████╗ █████╗  ██████╗██╗  ██╗
██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
███████╗   ██║   ███████║██║     █████╔╝ 
╚════██║   ██║   ██╔══██║██║     ██╔═██╗ 
███████║   ██║   ██║  ██║╚██████╗██║  ██╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-8">
          <div className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm">
            <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              DESCRIPTION
            </div>
            <h1 className="sr-only">
              JS-Stack CLI - Modern Full-Stack JavaScript Development Tool
            </h1>
            <p className="text-base leading-relaxed text-foreground">
              A powerful, modern CLI tool for scaffolding production-ready
              JavaScript full-stack projects with extensive customization
              options and best practices built-in.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-lg border border-border bg-card/50 p-4 transition-colors hover:border-primary/50">
            <div className="mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-sm text-muted-foreground">
                NPM_PACKAGE
              </span>
            </div>
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
              <a
                href="https://www.npmjs.com/package/@vipinyadav02/createjsstack"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-mono font-medium text-sm hover:text-primary transition-colors cursor-pointer"
              >
                @vipinyadav02/createjsstack
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card/50 p-4 transition-colors hover:border-primary/50">
            <div className="mb-3 flex items-center gap-2">
              <Github className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-sm text-muted-foreground">
                GITHUB_REPO
              </span>
            </div>
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
              <a
                href="https://github.com/vipinyadav01/js-stack"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-mono font-medium text-sm hover:text-primary transition-colors"
              >
                vipinyadav01/js-stack
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card/50 p-4 transition-colors hover:border-primary/50">
            <div className="mb-3 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-sm text-muted-foreground">
                VERSION
              </span>
            </div>
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
              <NpmVersion />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
