const { build } = require("esbuild");
const process = require("process");

console.log(`entryPoint: ${process.argv[2]}`);
console.log(`outputDirectory: ${process.argv[3]}`);

const define = {};
for (const k in process.env) {
  define[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

const options = {
  entryPoints: [process.argv[2]],
  outfile: process.argv[3],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  external: ["@aws-sdk/*"],
  define,
};

build(options).catch(() => process.exit(1));
