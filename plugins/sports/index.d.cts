// CommonJS type declarations for the require() entrypoint (./builds/wtf-plugin-sports.cjs).
// The real declarations (and the wtf_wikipedia augmentation) live in index.d.ts.
type Esm = typeof import('./index.js', { with: { 'resolution-mode': 'import' } })

declare const sports: {
  mlb: Esm['mlb']
  nhl: Esm['nhl']
}
export = sports
