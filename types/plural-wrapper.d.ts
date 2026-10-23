import type { JsonFormat, Link, Section, Template, Infobox } from './index.js'

// Forward item methods, preserving native Array methods.
type WrappedMethods<T> = {
  [K in Exclude<keyof T, keyof T[]> as T[K] extends (...args: any[]) => any ? K : never]: T[K] extends (
    ...args: infer Args
  ) => infer Result
    ? (...args: Args) => Result[]
    : never
}

type CollectionItem = {
  json: (format?: JsonFormat) => any
  text: (...args: any[]) => string
  wikitext: () => string
}

type Collection<T extends CollectionItem> = T[] & WrappedMethods<T>

type LinkCollection = Collection<Link>
type SectionCollection = Section[]
type TemplateCollection = Collection<Template>
type InfoboxCollection = Collection<Infobox>

export type { Collection, CollectionItem, LinkCollection, SectionCollection, TemplateCollection, InfoboxCollection }
