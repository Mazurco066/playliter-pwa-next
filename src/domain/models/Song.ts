import { BandType } from 'domain/models'

export type SongType = {
  id: string,
  createdAt: string,
  updatedAt: string,
  title: string,
  tone: string,
  writter: string,
  body: string,
  isPublic: boolean,
  category: {
    id: string,
    createdAt: string,
    updatedAt: string,
    title: string,
    description: string
  },
  band: {
    id: string,
    createdAt: string,
    updatedAt: string,
    logo: string,
    owner: string,
    description: string,
    title: string
  }
}
