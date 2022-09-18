import { AccountType } from 'domain/models'

export type BandType = {
  id: string,
  createdAt: string,
  updatedAt: string,
  title: string,
  description: string,
  logo?: string,
  admins: AccountType[],
  members: AccountType[],
  owner: AccountType
}