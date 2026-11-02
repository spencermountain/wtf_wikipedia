import type { Plugin } from 'wtf_wikipedia'

/** a parsed calendar date. month is 0-based, date is the day-of-month. year-only dates omit month and date */
export type PersonDate = {
  year?: number
  month?: number
  date?: number
}

/** the subject's names, from the infobox and first-sentence bolds */
export type PersonNames = {
  name: string | null
  birthName: string | null
  aliases: string[]
}

/** one marriage, from a {{marriage}} template or the infobox spouse field */
export type Spouse = {
  name: string
  from: string | null
  to: string | null
  end: string | null
}

/** the infobox children field - a count, a list of names, or both */
export type PersonChildren = {
  count: number | null
  names: string[]
}

declare module 'wtf_wikipedia' {
  interface Document {
    birthDate(): PersonDate | null
    deathDate(): PersonDate | null
    birthPlace(): string | null
    deathPlace(): string | null
    nationality(): string | null
    isAlive(): boolean | null
    names(): PersonNames | null
    occupation(): string[]
    spouses(): Spouse[]
    children(): PersonChildren | null
    /** current age of a living person; null for the dead */
    age(): number | null
  }
}

declare const personPlugin: Plugin & { version: string }
export default personPlugin
