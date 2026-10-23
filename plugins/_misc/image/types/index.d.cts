// CommonJS type declarations for the require() entrypoint (./builds/wtf-plugin-image.cjs).
// The real declarations (and the wtf_wikipedia augmentation) live in index.d.ts.
type Esm = typeof import('./index.js', { with: { 'resolution-mode': 'import' } })

declare const plugin: Esm['default']
export = plugin
