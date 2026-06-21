// CommonJS type declarations for the `require()` entrypoint (builds/wtf_wikipedia.cjs).
// The CJS build sets `module.exports = wtf`, so the types use `export =` to match.
// An inline `import(...)` type is type-only (erased), so it can reference the ESM
// declarations in index.d.ts without emitting a forbidden `require()` of an ESM file.
declare const wtf: typeof import('./index.js', { with: { 'resolution-mode': 'import' } }).default
export = wtf
