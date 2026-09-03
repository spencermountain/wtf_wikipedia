import type { Plugin, Document } from 'wtf_wikipedia'

declare module 'wtf_wikipedia' {
  interface Document {
    /** other pages that redirect to this one */
    getRedirects(): Promise<Record<string, unknown>[]>
    /** pages that link to this one */
    getIncoming(): Promise<Record<string, unknown>[]>
    /** daily page-view counts for this page */
    getPageViews(): Promise<Record<string, unknown>[]>
  }
  interface Wtf {
    getRandomPage(options?: object): Promise<Document | null>
    getRandomCategory(options?: object): Promise<string | null>
    getTemplatePages(template: string, options?: object): Promise<Record<string, unknown>[]>
    getCategoryPages(category: string, options?: object): Promise<Record<string, unknown>[]>
    fetchList(list: string[] | number[], options?: object): Promise<Document[]>
    getIncoming(title: string, options?: object): Promise<Record<string, unknown>[]>
    getRedirects(title: string, options?: object): Promise<Record<string, unknown>[]>
    /** alias of getRandomPage */
    random(options?: object): Promise<Document | null>
  }
}

/** adds api-fetching helpers to documents and to wtf itself - pass to wtf.extend() */
declare const apiPlugin: Plugin
export default apiPlugin
