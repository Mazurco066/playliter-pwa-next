import { AccountType } from 'domain/models'

export type InviteType = {
  id: string,
  createdAt: string,
  updatedAt: string,
  response: string,
  account: AccountType,
  band: {
    id: string,
    createdAt: string,
    updatedAt: string,
    title: string,
    description: string
  }
}