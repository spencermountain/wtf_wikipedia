import type { Plugin } from 'wtf_wikipedia'

/** a running win-loss record, like '49–26–7' */
export interface SeasonRecord {
  wins: number
  losses: number
  /** pre-2005 nhl */
  ties?: number
  /** post-2005 nhl overtime/shootout losses */
  otLosses?: number
  /** pwhl overtime/shootout wins, also counted in wins */
  otWins?: number
  /** ahl shootout losses, also counted in otLosses */
  soLosses?: number
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
  /** nba/wnba: statistical leaders, like "A'ja Wilson (30)" */
  leaders?: { points: string; rebounds: string; assists: string }
  /** nba/wnba: the arena; mls/nwsl: the city */
  location?: string
  /** nfl: the stadium */
  venue?: string
  /** mls/nwsl: the matchday; cfl playoffs: the round, like 'Grey Cup' */
  round?: string
  /** mls/nwsl: the stadium */
  stadium?: string
}

/** the standings fields every league shares */
export interface StandingsCore {
  record: SeasonRecord | null
  /** where the team finished - its division, conference or league table */
  place: string | number | null
  /** the head coach - or the manager, in soccer and baseball */
  coach: string
  /** the general manager, where the sport has one */
  gm: string
  /** the home ground, whether the sport calls it a stadium, arena or ballpark */
  venue: string
}

/** a roster/squad row - leagues add extra fields where their pages carry them */
export interface RosterRow {
  number: number | null
  name: string
  position: string
}

/** nba/wnba {{player2}} / {{sports roster/entry}} rows */
export interface BallRosterRow extends RosterRow {
  /** like `6'6"` */
  height: string
  /** in pounds */
  weight: number | null
  college: string
  dob: string
  nation: string
}

/** soccer {{Fs player}} / {{Efs player}} squad rows */
export interface SquadRow extends RosterRow {
  nation: string
}

/** one move from the page's transactions / transfers sections */
export interface Transaction {
  date: string
  /** 'trade', 'signing', 'release', 'waiver', 'claim', 'draft', 'loan', 'loan in/out',
   * 'transfer', 'transfer in/out', 'injured list', 'roster move', 'retired' - or null */
  type: string | null
  text: string
  player?: string
}

/** the season fields every league shares */
export interface SeasonBase {
  team: string
  year: number | null
  page: string
  /** date of the first league game */
  start: string | null
  /** date of the last league game */
  end: string | null
  /** average home attendance */
  attendance: number | null
  /** the raw team-season infobox */
  season: Record<string, string | number | SeasonRecord>
  games: Game[]
  roster: RosterRow[]
  transactions: Transaction[]
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

export interface NhlSeason extends SeasonBase {
  standings: StandingsCore & {
    division: string
    divisionPlace: number | null
    conference: string
    conferencePlace: number | null
    goalsFor: number | null
    goalsAgainst: number | null
  }
  /** one array per playoff series */
  playoffs: Game[][]
  skaters: NhlSkater[]
  goalies: NhlGoalie[]
}

export interface MlbSeason extends SeasonBase {
  standings: StandingsCore & {
    league: string
    division: string
    divisionPlace: number | null
    manager: string
    ballpark: string
  }
  /** one array per postseason series */
  postseason: Game[][]
  /** the same series, under the standard key */
  playoffs: Game[][]
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

export interface NbaSeason extends SeasonBase {
  standings: StandingsCore & {
    division: string
    divisionPlace: number | null
    conference: string
    conferencePlace: number | null
    arena: string
  }
  /** one array per playoff series */
  playoffs: Game[][]
  roster: BallRosterRow[]
  playerStats: {
    season: NbaPlayerStats[]
    playoffs: NbaPlayerStats[]
  }
}

export interface NflSeason extends SeasonBase {
  standings: StandingsCore & {
    division: string
    divisionPlace: number | null
    stadium: string
  }
  /** nfl playoffs are single games, kept flat */
  playoffs: Game[]
  /** always empty - nfl rosters transclude from separate template pages */
  roster: RosterRow[]
}

export interface MlsSeason extends SeasonBase {
  standings: StandingsCore & {
    /** counted from the league matches */
    record: SeasonRecord
    league: string
    position: string | number | null
    manager: string
    stadium: string
  }
  /** mls cup playoff matches, kept flat */
  playoffs: Game[]
  /** cup runs, keyed by competition section - {'Leagues Cup': [...]} */
  cups: Record<string, Game[]>
  roster: SquadRow[]
  /** the same rows, under the soccer name */
  squad: SquadRow[]
}

export interface WnbaSeason extends SeasonBase {
  standings: StandingsCore & {
    conference: string
    conferencePlace: number | null
    arena: string
  }
  /** one array per playoff series */
  playoffs: Game[][]
  roster: BallRosterRow[]
  playerStats: {
    season: NbaPlayerStats[]
    playoffs: NbaPlayerStats[]
  }
}

export interface NwslSeason extends SeasonBase {
  standings: StandingsCore & {
    /** counted from the league matches */
    record: SeasonRecord
    league: string
    position: string | number | null
    manager: string
    stadium: string
  }
  /** nwsl playoff matches, kept flat */
  playoffs: Game[]
  /** cup runs, keyed by competition section - {'NWSL Challenge Cup': [...]} */
  cups: Record<string, Game[]>
  roster: SquadRow[]
  /** the same rows, under the soccer name */
  squad: SquadRow[]
}

export interface PwhlSeason extends SeasonBase {
  standings: StandingsCore & {
    /** the pwhl is one table - no divisions */
    place: number | null
    goalsFor: number | null
    goalsAgainst: number | null
    arena: string
  }
  /** one array per playoff series */
  playoffs: Game[][]
  skaters: NhlSkater[]
  goalies: NhlGoalie[]
}

export interface CflSeason extends SeasonBase {
  standings: StandingsCore & {
    division: string
    divisionPlace: number | null
    stadium: string
  }
  /** cfl playoffs are single games, kept flat */
  playoffs: Game[]
  /** {{CFL player}} rows: N=national, I=international, G=global */
  roster: (RosterRow & { status: string })[]
}

export interface AhlSeason extends SeasonBase {
  standings: StandingsCore & {
    division: string
    divisionPlace: number | null
    conference: string
    conferencePlace: number | null
    goalsFor: number | null
    goalsAgainst: number | null
  }
  /** one array per playoff series */
  playoffs: Game[][]
  skaters: NhlSkater[]
  goalies: NhlGoalie[]
  /** {{Ice hockey team player}} roster rows, where the page has them */
  roster: RosterRow[]
}

export interface EplSeason extends SeasonBase {
  standings: StandingsCore & {
    /** counted from the league matches - draws land in `ties` */
    record: SeasonRecord
    /** three points for a win, one for a draw */
    points: number
    league: string
    position: string | number | null
    manager: string
    stadium: string
  }
  /** league matches only - each cup run parses separately */
  games: Game[]
  /** cup and european matches, keyed by competition section - {'FA Cup': [...]} */
  cups: Record<string, Game[]>
  roster: SquadRow[]
  /** the same rows, under the soccer name */
  squad: SquadRow[]
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
    /** parse a wnba team-season page into game data */
    wnbaSeason(): WnbaSeason | null
    /** parse an nwsl club-season page into match data */
    nwslSeason(): NwslSeason | null
    /** parse a pwhl team-season page into game data */
    pwhlSeason(): PwhlSeason | null
    /** parse a cfl team-season page into game data */
    cflSeason(): CflSeason | null
    /** parse an ahl team-season page into game data */
    ahlSeason(): AhlSeason | null
    /** parse a premier-league club-season page into match data */
    eplSeason(): EplSeason | null
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
    /** fetch + parse a wnba team's season page, like ('Las Vegas Aces', 2024) */
    wnbaSeason(team: string, year?: string | number, options?: object): Promise<WnbaSeason | null>
    /** fetch + parse an nwsl club's season page, like ('Kansas City Current', 2024) */
    nwslSeason(team: string, year?: string | number, options?: object): Promise<NwslSeason | null>
    /** fetch + parse a pwhl team's season page, like ('Minnesota Frost', 2024) */
    pwhlSeason(team: string, year?: string | number, options?: object): Promise<PwhlSeason | null>
    /** fetch + parse a cfl team's season page, like ('Toronto Argonauts', 2024) */
    cflSeason(team: string, year?: string | number, options?: object): Promise<CflSeason | null>
    /** fetch + parse an ahl team's season page, like ('Hershey Bears', 2023) */
    ahlSeason(team: string, year?: string | number, options?: object): Promise<AhlSeason | null>
    /** fetch + parse a premier-league club's season page, like ('Arsenal', 2023) */
    eplSeason(team: string, year?: string | number, options?: object): Promise<EplSeason | null>
  }
}

/** pass each to wtf.extend() */
export declare const mlb: Plugin
export declare const nhl: Plugin
export declare const nba: Plugin
export declare const nfl: Plugin
export declare const mls: Plugin
export declare const wnba: Plugin
export declare const nwsl: Plugin
export declare const pwhl: Plugin
export declare const cfl: Plugin
export declare const ahl: Plugin
export declare const epl: Plugin

export declare const version: string
