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

export interface NbaPlayerStats {
  name: string
  games: number
  gamesStarted: number
  minutesPerGame: number
  reboundsPerGame: number
  assistsPerGame: number
  stealsPerGame: number
  blocksPerGame: number
  pointsPerGame: number
}

export interface NbaSeason {
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
    coach: string
    arena: string
  }
  games: Game[]
  /** one array per playoff series */
  playoffs: Game[][]
  /** {{player2}} roster rows */
  roster: Record<string, unknown>[]
  playerStats: {
    season: NbaPlayerStats[]
    playoffs: NbaPlayerStats[]
  }
}

export interface NflSeason {
  team: string
  year: number | null
  page: string
  /** the raw team-season infobox */
  season: Record<string, string | number | SeasonRecord>
  standings: {
    record: SeasonRecord | null
    division: string
    divisionPlace: number | null
    coach: string
    stadium: string
  }
  games: Game[]
  /** nfl playoffs are single games, kept flat */
  playoffs: Game[]
}

export interface MlsSeason {
  team: string
  year: number | null
  page: string
  /** the raw club-season infobox */
  season: Record<string, string | number | SeasonRecord>
  standings: {
    /** counted from the league matches */
    record: SeasonRecord
    league: string
    position: string | number | null
    manager: string
    stadium: string
  }
  /** league matches - cups, friendlies and playoffs excluded */
  games: Game[]
  /** mls cup playoff matches, kept flat */
  playoffs: Game[]
}

declare module 'wtf_wikipedia' {
  interface Document {
    /** parse an mlb team-season page into game data */
    mlbSeason(): MlbSeason | null
    /** parse an nhl team-season page into game data */
    nhlSeason(): NhlSeason | null
    /** parse an nba team-season page into game data */
    nbaSeason(): NbaSeason | null
    /** parse an nfl team-season page into game data */
    nflSeason(): NflSeason | null
    /** parse an mls club-season page into match data */
    mlsSeason(): MlsSeason | null
  }
  interface Wtf {
    /** fetch + parse an mlb team's season page, like ('Toronto Blue Jays', 2025) */
    mlbSeason(team: string, year?: string | number, options?: object): Promise<MlbSeason | null>
    /** fetch + parse an nhl team's season page, like ('Toronto Maple Leafs', 2024) */
    nhlSeason(team: string, year?: string | number, options?: object): Promise<NhlSeason | null>
    /** fetch + parse an nba team's season page, like ('Toronto Raptors', 2024) */
    nbaSeason(team: string, year?: string | number, options?: object): Promise<NbaSeason | null>
    /** fetch + parse an nfl team's season page, like ('Buffalo Bills', 2024) */
    nflSeason(team: string, year?: string | number, options?: object): Promise<NflSeason | null>
    /** fetch + parse an mls club's season page, like ('LA Galaxy', 2024) */
    mlsSeason(team: string, year?: string | number, options?: object): Promise<MlsSeason | null>
  }
}

/** pass each to wtf.extend() */
export declare const mlb: Plugin
export declare const nhl: Plugin
export declare const nba: Plugin
export declare const nfl: Plugin
export declare const mls: Plugin

export declare const version: string
