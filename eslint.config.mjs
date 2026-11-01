import tseslint from 'typescript-eslint';
export default tseslint.config(
  {ignores:['obsidian-plugin/main.js','web/app.js','node_modules/**']},
  ...tseslint.configs.recommended,
  {files:['src/**/*.ts','obsidian-plugin/src/**/*.ts','web/**/*.ts','tests/**/*.ts'],rules:{'@typescript-eslint/no-unused-vars':['error',{argsIgnorePattern:'^_',varsIgnorePattern:'^_'}]}}
);
