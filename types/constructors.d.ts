// Type definitions for wtf_wikipedia 7.3.0
// Project: https://github.com/spencermountain/wtf_wikipedia#readme
// Definitions by: Rob Rose <https://github.com/RobRoseKnows>
//                 Mr. Xyfir <https://github.com/MrXyfir>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import { Document } from './types'

// export function WtfConstructor(wiki: string, options?: any): Document

export interface WtfConstructor {
  (text: string, options?: any): Document
}

export interface WtfStatic extends WtfConstructor {
  /** fetch a page from wikipedia */
  fetch: (title: string, lang?: string, options?: any, cb?: any) => Promise<null | Document>
  /** fetch and parse get a random page */
  random: (lang: string, options: object, cb: any) => Promise<Document>

  /** return pages from a category */
  category: (cat: string, lang: string, options: object, cb: any) => Promise<Document>
}
