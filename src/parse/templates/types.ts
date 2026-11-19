export type NestedNode = {
  children: NestedNode[]
  parserName: string | null
  wiki: string
  body: string
}
