export type BlockWithChildren = {
  id: string
  type: string
  children?: BlockWithChildren[]
  [key: string]: any
}