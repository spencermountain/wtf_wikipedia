// CommonJS type declarations for the `require()` entrypoint (builds/wtf_wikipedia.cjs).
// The CJS build sets `module.exports = wtf`, so the types use `export =` to match.
// The inline `import(...)` types are type-only (erased), so they can reference the
// ESM declarations in index.d.ts without emitting a forbidden `require()` of an ESM file.
type Esm = typeof import('./index.js', { with: { 'resolution-mode': 'import' } })

declare const wtf: Esm['default']

// re-expose the class types so CJS consumers can write `wtf.Document`, mirroring ESM.
declare namespace wtf {
  export type Document = import('./index.js', { with: { 'resolution-mode': 'import' } }).Document
  export type Section = import('./index.js', { with: { 'resolution-mode': 'import' } }).Section
  export type Infobox = import('./index.js', { with: { 'resolution-mode': 'import' } }).Infobox
  export type Template = import('./index.js', { with: { 'resolution-mode': 'import' } }).Template
  export type Table = import('./index.js', { with: { 'resolution-mode': 'import' } }).Table
  export type Reference = import('./index.js', { with: { 'resolution-mode': 'import' } }).Reference
  export type Paragraph = import('./index.js', { with: { 'resolution-mode': 'import' } }).Paragraph
  export type Image = import('./index.js', { with: { 'resolution-mode': 'import' } }).Image
  export type Link = import('./index.js', { with: { 'resolution-mode': 'import' } }).Link
  export type List = import('./index.js', { with: { 'resolution-mode': 'import' } }).List
  export type Sentence = import('./index.js', { with: { 'resolution-mode': 'import' } }).Sentence
}

export = wtf
