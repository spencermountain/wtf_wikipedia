import type { Plugin } from 'wtf_wikipedia'

declare module 'wtf_wikipedia' {
  interface Document {
    /** parse a mlb team-season page into game data */
    mlbSeason(): Record<string, unknown> | null
  }
  interface Wtf {
    mlbSeason(team: string, year: string | number): Promise<unknown>
    nhlSeason(team: string, year: string | number): Promise<unknown>
  }
}

/** pass each to wtf.extend() */
export declare const mlb: Plugin
export declare const nhl: Plugin
