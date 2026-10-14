import type { Plugin } from 'wtf_wikipedia'

/** registers non-english aliases for common templates - pass to wtf.extend() */
declare const i18nPlugin: Plugin & { version: string }
export default i18nPlugin
