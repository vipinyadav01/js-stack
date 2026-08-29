import { source } from "@/lib/source";
import { getLLMText } from "@/lib/get-llm-text";

export const revalidate = false;

const HEADER = `# JS-Stack CLI — Full Documentation (@vipinyadav02/createjsstack)

> Author: Vipin Yadav
> Email: vipinxyadav.work@gmail.com
> Portfolio: https://devxvipin.me
> Website: https://createjsstack.dev
> GitHub: https://github.com/vipinyadav01/js-stack
> npm: https://www.npmjs.com/package/@vipinyadav02/createjsstack

`;

export async function GET() {
  const scan = source.getPages().map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(HEADER + scanned.join("\n\n"));
}
