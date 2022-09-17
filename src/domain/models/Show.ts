export type ShowType = {
  id: string,
  createdAt: string,
  updatedAt: string,
  title: string,
  description: string,
  date: string,
  band: {
    id: string,
    createdAt: string,
    updatedAt: string,
    title: string,
    description: string
  }
  songs: {
    id: string,
    createdAt: string,
    updatedAt: string,
    title: string,
    writter: string,
    tone: string,
    body: string,
    isPublic: boolean
  }[],
  observations: {
    id: string,
    title: string,
    data: string
  }[]
}