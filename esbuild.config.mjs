import esbuild from 'esbuild';
await esbuild.build({entryPoints:['obsidian-plugin/src/main.ts'],bundle:true,platform:'browser',format:'cjs',target:'es2022',external:['obsidian','electron'],outfile:'obsidian-plugin/main.js',logLevel:'info'});
await esbuild.build({entryPoints:['web/main.ts'],bundle:true,platform:'browser',format:'iife',target:'es2022',define:{localStorage:'undefined'},outfile:'web/app.js',logLevel:'info'});
