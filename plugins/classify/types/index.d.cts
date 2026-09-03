// CommonJS type declarations for the require() entrypoint (./builds/wtf-plugin-classify.cjs).
// The real declarations (and the wtf_wikipedia augmentation) live in index.d.ts.
type Esm = typeof import('./index.js', { with: { 'resolution-mode': 'import' } })

declare const plugin: Esm['default']
declare namespace plugin {
  export type ClassifyResult = import('./index.js', { with: { 'resolution-mode': 'import' } }).ClassifyResult
}
export = plugin
