import type { Plugin, Image } from 'wtf_wikipedia'

declare module 'wtf_wikipedia' {
  interface Document {
    /** the infobox or first image of the page */
    mainImage(): Image | null
  }
  interface Image {
    /** the wikimedia-commons page url for this image */
    commonsURL(): string
    /** test whether the image url actually resolves */
    exists(callback?: (err: unknown, exists: boolean) => void): Promise<boolean>
    /** license information for this image, once fetched */
    license(): Promise<Record<string, unknown> | null>
  }
}

declare const imagePlugin: Plugin
export default imagePlugin
