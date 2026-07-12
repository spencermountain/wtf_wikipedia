import hardcoded from './hardcoded.ts'
import easyInline from './easy-inline.ts'
import shorthand from './shorthand-link.ts'
import functions from './functions.ts'
import abbreviations from './abbreviations.ts'
import moreLangs from './languages.ts'
import flags from './flags.ts'
import table from './table-cell.ts'

export default Object.assign({}, hardcoded, easyInline, shorthand, functions, moreLangs, abbreviations, flags, table)
