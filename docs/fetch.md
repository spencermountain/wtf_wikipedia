# Fetching pages

`wtf.fetch()` downloads wikitext from a mediawiki API and returns parsed
`Document`s. It works with any language, any wikimedia project, and most
third-party wikis. Requires network access; uses native `fetch` (Node ≥ 18).

## Signatures

```ts
wtf.fetch(title: string | number | URL): Promise<Document | null>
wtf.fetch(title, lang: string): Promise<Document | null>          // 'fr', 'de', ...
wtf.fetch(title, options: FetchOptions): Promise<Document | null>
wtf.fetch(titles: string[] | number[], options?): Promise<Document[]>
wtf.fetch(title, options, callback)   // legacy callback form also works
```

- a **string** title fetches that page: `wtf.fetch('Toronto Raptors')`
- a **number** is a wikimedia pageID: `wtf.fetch(64646, 'de')`
- a **full url** hits that wiki: `wtf.fetch('https://muppet.fandom.com/wiki/Miss_Piggy')`
- an **array** returns an array (must be all-titles or all-pageIDs, not mixed).
  Requests are chunked 50 titles per API call automatically.
- a **missing/invalid page resolves to `null`** — always check before using.

## Options

| option | default | meaning |
| --- | --- | --- |
| `lang` | `'en'` | language subdomain |
| `wiki` | `'wikipedia'` | project: `'wikivoyage'`, `'wiktionary'`, … |
| `domain` | — | full domain override for 3rd-party wikis |
| `path` | `'api.php'` | some 3rd-party wikis use `'w/api.php'` etc |
| `follow_redirects` | `true` | fetch the redirect target instead of the stub |
| `'Api-User-Agent'` (or `userAgent`) | generic | identify your script — set this |
| `origin` / `noOrigin` | — | CORS origin param handling (browser) |

```js
// german wikivoyage
let doc = await wtf.fetch('Toronto', { lang: 'de', wiki: 'wikivoyage' })

// batch, politely identified
let docs = await wtf.fetch(['Royal Cinema', 'Aldous Huxley'], {
  lang: 'en',
  'Api-User-Agent': 'me@example.com',
})
```

## Etiquette (from the wikimedia API guidelines)

- always pass an `Api-User-Agent`
- batch page-titles into arrays (groups of ~5) instead of separate calls
- run large jobs serially, not in parallel

## Errors

Network/HTTP failures **reject** the promise; missing pages **resolve `null`**:

```js
let doc = await wtf.fetch('Page that does not exist zzz')
// doc === null
```

## More API methods (wtf-plugin-api)

`wtf.extend(apiPlugin)` adds fetch-adjacent statics — random pages, category
listings, incoming links, page-views. See [plugins.md](./plugins.md#api).

## Parsing whole dumps

Don't fetch millions of pages — parse a downloaded dump with
[dumpster-dive](https://github.com/spencermountain/dumpster-dive), which uses
this library and can chew through english wikipedia in an afternoon.
