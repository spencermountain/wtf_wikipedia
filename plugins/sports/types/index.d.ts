import type { Plugin } from 'wtf_wikipedia'

/** a running win-loss record, like '49–26–7' */
export interface SeasonRecord {
  wins: number
  losses: number
  /** pre-2005 nhl */
  ties?: number
  /** post-2005 nhl overtime/shootout losses */
  otLosses?: number
  games: number
  winPct: number
}

/** one game of a season */
export interface Game {
  date: string
  opponent: string
  home: boolean | null
  outcome: 'win' | 'loss' | 'otl' | 'tie' | 'postponed' | null
  win: boolean | null
  result: { us: number; them: number } | null
  overtime: boolean
  shootout?: boolean
  record: SeasonRecord | null
  attendance: number | null
  /** game number in the season */
  game?: number
  /** nhl: cumulative team points */
  points?: number
  /** nhl: the goalie of record */
  decision?: string
  /** mlb: the pitchers of record */
  pitchers?: { win: string; loss: string; save: string | null }
  /** mlb: games behind the division lead */
  gamesBack?: string
}

export interface NhlSkater {
  name: string
  games: number
  goals: number
  assists: number
  points: number
  plusMinus: number
}

export interface NhlGoalie {
  name: string
  games: number
  wins: number
  losses: number
  otLosses: number
  goalsAgainstAvg: number
  savePct: number
  shutouts: number
}

export interface NhlSeason {
  team: string
  year: number | null
  page: string
  /** the raw team-season infobox */
  season: Record<string, string | number | SeasonRecord>
  standings: {
    record: SeasonRecord | null
    division: string
    divisionPlace: number | null
    conference: string
    conferencePlace: number | null
    goalsFor: number | null
    goalsAgainst: number | null
  }
  games: Game[]
  /** one array per playoff series */
  playoffs: Game[][]
  skaters: NhlSkater[]
  goalies: NhlGoalie[]
}

export interface MlbSeason {
  team: string
  year: number | null
  page: string
  /** the raw team-season infobox */
  season: Record<string, string | number | SeasonRecord>
  standings: {
    record: SeasonRecord | null
    league: string
    division: string
    divisionPlace: number | null
    manager: string
    ballpark: string
  }
  games: Game[]
  /** one array per postseason series */
  postseason: Game[][]
  roster: Record<string, unknown>[]
  draftPicks: object
  playerStats: {
    batters: Record<string, string>[]
    pitchers: Record<string, string>[]
  }
}

declare module 'wtf_wikipedia' {
  interface Document {
    /** parse an mlb team-season page into game data */
    mlbSeason(): MlbSeason | null
    /** parse an nhl team-season page into game data */
    nhlSeason(): NhlSeason | null
  }
  interface Wtf {
    /** fetch + parse an mlb team's season page, like ('Toronto Blue Jays', 2025) */
    mlbSeason(team: string, year?: string | number, options?: object): Promise<MlbSeason | null>
    /** fetch + parse an nhl team's season page, like ('Toronto Maple Leafs', 2024) */
    nhlSeason(team: string, year?: string | number, options?: object): Promise<NhlSeason | null>
  }
}

/** pass each to wtf.extend() */
export declare const mlb: Plugin
export declare const nhl: Plugin

export declare const version: string
