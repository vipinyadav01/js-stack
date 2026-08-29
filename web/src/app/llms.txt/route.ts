import { llms } from "fumadocs-core/source";
import { source } from "@/lib/source";

export const revalidate = false;

const HEADER = `# JS-Stack CLI (@vipinyadav02/createjsstack)

> Author: Vipin Yadav
> Email: vipinxyadav.work@gmail.com
> Portfolio: https://devxvipin.me
> Website: https://createjsstack.dev
> GitHub: https://github.com/vipinyadav01/js-stack
> npm: https://www.npmjs.com/package/@vipinyadav02/createjsstack

A powerful CLI for scaffolding production-ready JavaScript/TypeScript full-stack applications with React, Next.js, Vue, Svelte, Express, Hono, Nest, Prisma, Drizzle, and more.

`;

export function GET() {
  const index = llms(source).index();
  return new Response(HEADER + index);
}
