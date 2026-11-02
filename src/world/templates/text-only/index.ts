import hardcoded from './hardcoded.ts'
import easyInline from './easy-inline.ts'
import shorthand from './shorthand-link.ts'
import functions from './functions.ts'
import abbreviations from './abbreviations.ts'
import moreLangs from './languages.ts'
import flags from './flags.ts'
import table from './table-cell.ts'
import inline from './inline.ts'
import parserFunctions from './parser-functions.ts'
import numbers from './numbers.ts'
import sportsTeams from './sports-teams.ts'

// generated families (flag codes, lang-xx) go first, so any hand-written handler wins over a generated name
export default {
  ...flags,
  ...moreLangs,
  ...hardcoded,
  ...easyInline,
  ...shorthand,
  ...functions,
  ...abbreviations,
  ...table,
  ...inline,
  ...parserFunctions,
  ...numbers,
  ...sportsTeams,
}
