import Hero from "@/components/hero";
import Command from "@/components/command";
import ProjectInt from "@/components/ProjectInt";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Hero />
      {/* Command Section */}
      <div className="mx-auto max-w-[1280px] px-4">
        <Command />
      </div>
      {/* Integration Guide */}
      <div className="mx-auto max-w-[1280px] px-4">
        <ProjectInt />
      </div>
    </div>
  );
}
