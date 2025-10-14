import { Suspense } from "react";
import { StackBuilder } from "./_components/stack-builder";

export const metadata = {
  title: "Stack Builder | JS-Stack",
  description:
    "Build your perfect JavaScript full-stack project with our interactive stack builder",
};

export default function NewPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <div className="grid h-[calc(100vh-64px)] w-full flex-1 grid-cols-1 overflow-hidden">
        <StackBuilder />
      </div>
    </Suspense>
  );
}
