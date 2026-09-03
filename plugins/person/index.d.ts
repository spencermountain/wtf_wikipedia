import type { Plugin } from 'wtf_wikipedia'

/** a parsed calendar date. month is 0-based, date is the day-of-month */
export type PersonDate = {
  year?: number
  month?: number
  date?: number
}

declare module 'wtf_wikipedia' {
  interface Document {
    birthDate(): PersonDate | null
    deathDate(): PersonDate | null
    birthPlace(): string | null
    deathPlace(): string | null
    nationality(): string | null
    isAlive(): boolean
  }
}

declare const personPlugin: Plugin
export default personPlugin
