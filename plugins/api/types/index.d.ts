import type { Plugin } from 'wtf_wikipedia'

declare module 'wtf_wikipedia' {
  interface Document {
    /** other pages that redirect to this one */
    getRedirects(): Promise<Record<string, unknown>[]>
    /** pages that link to this one */
    getIncoming(): Promise<Record<string, unknown>[]>
    /** daily page-view counts for this page */
    getPageViews(): Promise<Record<string, unknown>[]>
    /** a good, representative image for this page */
    mainImage(): Image | null
    /** the rendered html for this page, from the wikimedia parse API */
    getHtml(): Promise<string | null>
    /** the raw wikitext for this page, from the wikimedia parse API */
    getWikiscript(): Promise<string | null>
    /** the page as plaintext, from the wikimedia TextExtracts API */
    getExtract(options?: { sections?: 'wiki' | 'plain' | 'raw'; [key: string]: unknown }): Promise<string | null>
  }
  interface Image {
    /** a direct url to the file on the wikimedia-commons server */
    commonsURL(): string
    /** HEAD-request the image url, to check that it resolves */
    exists(options?: object): Promise<boolean | null>
    /** license + attribution info for the image, from the commons API */
    license(options?: object): Promise<{
      license: string
      artist: string
      credit: string
      attributionRequired: string
    } | null>
  }
  interface Wtf {
    getRandomPage(options?: object): Promise<Document | null>
    getRandomCategory(options?: object): Promise<string | null>
    getTemplatePages(template: string, options?: object): Promise<Record<string, unknown>[]>
    getCategoryPages(category: string, options?: object): Promise<Record<string, unknown>[]>
    fetchList(list: string[] | number[], options?: object): Promise<Document[]>
    getIncoming(title: string, options?: object): Promise<Record<string, unknown>[]>
    getRedirects(title: string, options?: object): Promise<Record<string, unknown>[]>
    /** the rendered html for a page, from the wikimedia parse API */
    getHtml(title: string, options?: object): Promise<string | null>
    /** the raw wikitext for a page, from the wikimedia parse API */
    getWikiscript(title: string, options?: object): Promise<string | null>
    /** a page as plaintext, from the wikimedia TextExtracts API */
    getExtract(title: string, options?: { sections?: 'wiki' | 'plain' | 'raw'; [key: string]: unknown }): Promise<string | null>
    /** alias of getRandomPage */
    random(options?: object): Promise<Document | null>
  }
}

/** adds api-fetching helpers to documents and to wtf itself - pass to wtf.extend() */
declare const apiPlugin: Plugin & { version: string }
export default apiPlugin
