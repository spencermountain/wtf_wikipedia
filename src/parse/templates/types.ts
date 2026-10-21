export type NestedNode = {
  parent?: NestedNode
  children?: NestedNode[]
  name?: string
  body?: string
  wiki?: string
}
