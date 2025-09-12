import { Separator } from "@/components/ui/separator";

import Hero from "@/components/hero";
import Command from "@/components/command";
import ProjectInt from "@/components/ProjectInt";
export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <Hero />
      <Separator />
      {/* Command Section */}
      <Command />
      <Separator />
      {/* Integration Guide */}
      <ProjectInt />
      <Separator />
    </div>
  );
}
