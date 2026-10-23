export type NestedNode = {
  parent?: NestedNode | null
  children: NestedNode[]
  parserName: string | null
  wiki: string
  body: string
}
