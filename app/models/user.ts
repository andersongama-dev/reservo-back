import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['user_email'],
  passwordColumnName: 'user_password',
})

export enum UserRole {
  BARBER = 'barber',
  CUSTOMER = 'customer',
}

export default class User extends compose(BaseModel, AuthFinder) {
  static primaryKey = 'user_id'

  @column({ isPrimary: true })
  declare user_id: number

  @column()
  declare user_name: string | null

  @column()
  declare user_email: string

  @column({ serializeAs: null })
  declare user_password: string

  @column()
  declare user_role: UserRole

  @column()
  declare user_status: boolean

  @column()
  declare onboarding_completed: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
