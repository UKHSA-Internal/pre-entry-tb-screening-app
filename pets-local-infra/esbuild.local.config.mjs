import * as esbuild from "esbuild";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

delete process.env['ProgramFiles(x86)']
delete process.env['CommonProgramFiles(x86)']

const define = {};
for (const k in process.env) {
  define[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

const outbase = join(__dirname, "..");
const options = {
  entryPoints: [
    "../pets-core-services/src/**/lambdas/*.ts",
    "../pets-core-services/src/authoriser/b2c-authoriser.ts",
  ],
  outdir: "build",
  outbase,
  bundle: true,
  platform: "node",
  target: "node18",
  define,
};

const main = async () => {
  const watchMode = process.argv.includes("--watch");

  if (!watchMode) {
    await esbuild.build(options);
    return;
  }

  let ctx = await esbuild.context(options);
  await ctx.watch();
  console.log("watching pets core services changes...");
};

await main();
