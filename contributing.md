Pull requests are always welcome and respected. Cosmetic things are never blockers.

Before making a big PR, please open an issue to ask questions.

Development uses Node 24+ and pnpm (the exact pnpm version is pinned in `package.json`). The lightly-typed TypeScript source runs directly in Node using native type stripping. Published users get the compiled `builds` files and only need Node 18.

Run `pnpm install` from the repository root to install the core and every plugin, including `plugins/wikis/*`. Commit the shared `pnpm-lock.yaml`; do not generate per-plugin npm lockfiles.

```sh
pnpm run build:all          # core first, then plugins with build scripts
pnpm test                  # core source tests
pnpm run testb             # core built-output tests
pnpm run test:plugins      # plugin source tests
pnpm run test:plugins:built # plugin built-output tests
pnpm run lint
pnpm run check
pnpm run test:types
pnpm --filter wtf-plugin-html run test
```

Plugins use ordinary npm version ranges. pnpm links their matching development dependency on `wtf_wikipedia` to the local root package. When bumping the core version, update the plugins' development dependencies and peer minimums together: latest plugins are developed and tested against the latest core. There are no `workspace:` or `catalog:` dependency references.

Each package keeps its own version and can be published independently. After building and testing, the existing npm workflow still works:

```sh
cd plugins/html
npm run build
npm run testb
npm publish --dry-run
npm publish
```

TypeScript is pinned to 6.0.3, the latest version supported by typescript-eslint 8.70.0. Upgrade it when the parser supports TypeScript 7; the legacy Node 10 module-resolution declaration test will also need revisiting then.

See **[Instructions for contributing](https://github.com/spencermountain/wtf_wikipedia/wiki/Contributing)**

Projects like this done collaboratively, or not at all!
