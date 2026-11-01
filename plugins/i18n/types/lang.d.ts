import type { Plugin } from 'wtf_wikipedia'

/** registers one language's template aliases - pass to wtf.extend() */
declare const langPlugin: Plugin & { version: string; lang?: string }
export default langPlugin

/** a core-style parser fn — see src/langs/_lib.js translate() */
type LangParser = ((tmpl: string, parse: Function, opts?: object, templates?: object) => { data?: object; replacement?: string }) & {
  kind?: string
  template?: string
  map?: Record<string, string>
}

/** the pack's raw data */
export declare const data: {
  aliases: Record<string, string>
  infoboxes: string[]
  parsers: Record<string, LangParser>
}
