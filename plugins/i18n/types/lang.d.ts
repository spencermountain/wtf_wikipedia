// type declarations for the per-language entrypoints ('wtf-plugin-i18n/fr', 'wtf-plugin-i18n/all', …)

/** a custom parser fn, hooking into the core template registry */
export type LangParser = (
  tmpl: string,
  parse: (tmpl: string, order?: string[], format?: string) => Record<string, unknown>,
  opts?: Record<string, unknown>,
  templates?: Record<string, Function>
) => { data?: unknown; replacement?: string }

/** a template definition: a param-map onto a core template, a core-style shortcut, or a parser fn */
export type TemplateDef =
  | { template: string; map?: Record<string, string> }
  | string[]
  | number
  | string
  | { props: string[]; out: string }
  | LangParser

/** one language's template data — wrap with 'wtf-plugin-i18n/plugin' and pass to wtf.extend() */
declare const data: {
  lang: string
  enLang: string
  /** this wiki's category namespace names */
  category: string[]
  /** this wiki's redirect keywords */
  redirect: string[]
  /** this wiki's stub template names */
  stub: string[]
  /** this wiki's infobox template prefixes (when not plain 'infobox') */
  infobox: string[]
  /** this wiki's file/image namespace names */
  image: string[]
  /** this wiki's references-section titles */
  reference: string[]
  /** this wiki's disambiguation template names */
  disambig: string[]
  /** this wiki's disambiguation page-title markers */
  disambigTitle: string[]
  aliases: Record<string, string>
  infoboxes: string[]
  templates: Record<string, TemplateDef>
  /** defs applied only when a document's lang matches the pack — for names too generic to claim globally */
  gated?: Record<string, TemplateDef>
}
export default data
