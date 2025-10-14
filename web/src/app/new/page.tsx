import { StackBuilder } from "./_components/stack-builder";

export const metadata = {
  title: "Stack Builder | JS-Stack",
  description:
    "Build your perfect JavaScript full-stack project with our interactive stack builder",
};

export default function NewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Build Your Stack
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Configure your perfect JavaScript full-stack project
          </p>
        </div>

        <StackBuilder />
      </div>
    </div>
  );
}
