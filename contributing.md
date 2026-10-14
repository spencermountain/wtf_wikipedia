Pull requests are always welcome and respected. Cosmetic things are never blockers.

Before making a big PR, please open an issue to ask questions.

Development uses Node 24+ and pnpm (the exact pnpm version is pinned in `package.json`). The lightly-typed TypeScript source runs directly in Node using native type stripping. Published users get the compiled `builds` files and only need Node 18. Runtime source and builds target ES2022. Browser bundles require ES2022-capable browsers, including native `Object.hasOwn`, `Array.prototype.at`, and `String.prototype.replaceAll`; builds do not include polyfills.

CI builds on the development Node versions, then checks the compiled package on Node 18. `pnpm run test:runtime` runs the offline public API suites against the built core; tests that import TypeScript internals remain in the development-node suite.

Run `pnpm install` from the repository root. The active packages are the core and `plugins/*`; the experimental `plugins/wikis/*` packages are currently excluded. Commit the shared `pnpm-lock.yaml`; do not generate per-plugin lockfiles.

```sh
pnpm run test:all                   # build, lint, types, and all source/built tests
pnpm run build:all                  # core first, then all workspace plugins
pnpm test                          # core source tests, including live API requests
pnpm run test:built                 # core built-output tests; build first
pnpm run test:plugins               # build and test every plugin; build core first
pnpm -r run test                    # every plugin's source tests
pnpm --filter wtf-plugin-html test:all
```

`test:all` is the complete verification command, both at the root and in each plugin. The root builds the core first, then runs plugin suites one at a time. A plugin's `test:all` builds that plugin and runs its source and built tests. Build the core once before running a plugin's `test:all` in isolation. `test` and `test:built` include live API tests, so these commands require network access.

All plugins target the current core, including unreleased changes. Their development dependency is `wtf_wikipedia: workspace:*`, and their peer dependency is `>=9.0.0`: there are no upper-version guards or compatibility branches for older releases. Install from the workspace root; the core is never fetched from the registry for plugin development.

Shared development tools and formatting settings live in the root `package.json`. Plugin runtime dependencies stay in each plugin's manifest. Each plugin owns a standalone `rollup.config.js` with its output formats, browser global, optional size budget, and bundling options. Package test scripts invoke Tape directly, and `tests/lib/plugin.js` loads only the requested source or built entrypoint. All tests use `*.test.js`, including tests that make live API requests.

Each package keeps its own version and can be published independently. Use pnpm to pack and publish so workspace dependency references are converted to npm-compatible versions:

```sh
pnpm run build
pnpm --filter wtf-plugin-html test:all
pnpm --filter wtf-plugin-html pack --pack-destination /tmp
pnpm --filter wtf-plugin-html publish
```

The release workflow verifies the whole workspace and publishes the core. Plugin publishing remains an explicit, independently versioned operation.

TypeScript is pinned to 6.0.3, the latest version supported by typescript-eslint 8.70.0. Upgrade it when the parser supports TypeScript 7; the legacy Node 10 module-resolution declaration test will also need revisiting then.

See **[Instructions for contributing](https://github.com/spencermountain/wtf_wikipedia/wiki/Contributing)**

Projects like this done collaboratively, or not at all!
