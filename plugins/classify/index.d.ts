import type { Plugin } from 'wtf_wikipedia'

/** the result of doc.classify() */
export type ClassifyResult = {
  root?: string
  type: string | null
  score: number
  details?: Record<string, unknown[]>
  detail?: Record<string, unknown[]>
}

declare module 'wtf_wikipedia' {
  interface Document {
    /** guess what category of thing this page is about */
    classify(): ClassifyResult
  }
}

declare const classifyPlugin: Plugin
export default classifyPlugin
