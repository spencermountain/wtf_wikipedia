import type { Plugin } from 'wtf_wikipedia'

declare module 'wtf_wikipedia' {
  interface Document {
    /** returns a reason string, or false when the page looks okay */
    hasBadTable(): string | false
    hasNoText(): string | false
    isLongStub(): string | false
    hasIPAPunct(): string | false
    isBad(): string | false
  }
}

declare const debugPlugin: Plugin
export default debugPlugin
