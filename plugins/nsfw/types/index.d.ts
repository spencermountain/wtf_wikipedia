import type wtf from 'wtf_wikipedia'

/** the broad category a piece of content was flagged under */
export type NsfwType =
  'sexuality' | 'drug-use' | 'weapons' | 'violence' | 'profanity' | 'obscenity'

/** where a piece of evidence was found */
export type NsfwSource = 'title' | 'image' | 'template' | 'category'

/** one matched template, category, page-title or image */
export interface NsfwEvidence {
  source: NsfwSource
  /** the matched name, like 'human sexuality' */
  name: string
  /** the full parsed json of the matched template or image */
  data?: object
}

/** one content-warning, with everything that triggered it */
export interface NsfwWarning {
  type: NsfwType
  evidence: NsfwEvidence[]
}

/** the method this plugin adds to every Document */
export interface NsfwMethods {
  /**
   * list content-warnings found in categories, templates, titles and images.
   * an empty array means nothing was flagged. sorted most-evidence-first.
   */
  nsfw(): NsfwWarning[]
}

/**
 * a wtf_wikipedia Document with `.nsfw()` attached.
 * before wtf_wikipedia 10.5, Document was not exported by name, so the module
 * augmentation below could not merge with it - cast to this type instead:
 *   const doc = wtf(text) as NsfwDocument
 */
export type NsfwDocument = wtf.Document & NsfwMethods

// merges into Document on wtf_wikipedia 10.5+, which exports the class type. a no-op before that.
declare module 'wtf_wikipedia' {
  interface Document extends NsfwMethods {}
}

/** pass this to `wtf.extend()` to add `doc.nsfw()` */
declare const nsfwPlugin: (models: { Doc: { prototype: object } }) => void
export default nsfwPlugin
