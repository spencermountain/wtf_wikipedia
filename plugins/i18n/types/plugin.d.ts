// type declarations for the 'wtf-plugin-i18n/plugin' entrypoint
import type { Plugin } from 'wtf_wikipedia'
import type data from './lang.js'

/** wraps one or more language data packs as a wtf plugin: wtf.extend(plugin(fr)) */
declare const plugin: (...packs: Partial<typeof data>[]) => Plugin & { version: string; lang?: string }
export default plugin
