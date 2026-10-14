import type { Plugin } from 'wtf_wikipedia'

/** registers openstreetmap-specific templates and infoboxes - pass to wtf.extend() */
declare const openstreetmapPlugin: Plugin & { version: string }
export default openstreetmapPlugin
