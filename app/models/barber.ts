import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Barber extends BaseModel {
  @column({ isPrimary: true })
  declare barber_id: number

  @column()
  declare user_id: number

  @column()
  declare barbershop_id: number | null

  @column()
  declare barber_function: string

  @column()
  declare invitation_code: string

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
