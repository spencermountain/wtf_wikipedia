// CommonJS type declarations for the `require()` entrypoint (builds/wtf-plugin-nsfw.cjs),
// which sets `module.exports = plugin`. The real declarations, including the
// wtf_wikipedia augmentation, live in index.d.ts - this file re-exposes them with `export =`.
type Esm = typeof import('./index.js', { with: { 'resolution-mode': 'import' } })

declare const nsfwPlugin: Esm['default']

declare namespace nsfwPlugin {
  export type NsfwType = import('./index.js', { with: { 'resolution-mode': 'import' } }).NsfwType
  export type NsfwSource = import('./index.js', { with: { 'resolution-mode': 'import' } }).NsfwSource
  export type NsfwEvidence = import('./index.js', { with: { 'resolution-mode': 'import' } }).NsfwEvidence
  export type NsfwWarning = import('./index.js', { with: { 'resolution-mode': 'import' } }).NsfwWarning
  export type NsfwMethods = import('./index.js', { with: { 'resolution-mode': 'import' } }).NsfwMethods
  export type NsfwDocument = import('./index.js', { with: { 'resolution-mode': 'import' } }).NsfwDocument
}

export = nsfwPlugin
