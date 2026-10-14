import type { Plugin } from 'wtf_wikipedia'

/** registers wikivoyage-specific templates and infoboxes - pass to wtf.extend() */
declare const wikivoyagePlugin: Plugin & { version: string }
export default wikivoyagePlugin
