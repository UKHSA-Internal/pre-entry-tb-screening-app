import * as esbuild from "esbuild";

const define = {};

for (const k in process.env) {
  define[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

const options = {
  entryPoints: ["../pets-core-services/src/**/lambdas/*.ts"],
  outdir: "../pets-core-services/src",
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
