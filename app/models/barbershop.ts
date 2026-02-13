import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Barbershop extends BaseModel {
  @column({ isPrimary: true })
  declare barbershop_id: number

  @column()
  declare barbershop_name: string

  @column()
  declare barbershop_phone: string

  @column()
  declare barbershop_city: string

  @column()
  declare barbershop_status: boolean

  @column()
  declare invitation_code: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
