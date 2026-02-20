import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export enum By {
  BARBER = 'barber',
  BARBERSHOP = 'barbershop',
}

export default class Invitation extends BaseModel {
  @column({ isPrimary: true })
  declare invitation_id: number

  @column()
  declare invitation_by: By

  @column()
  declare barbershop_id: number

  @column()
  declare barber_id: number

  @column()
  declare invitation_status: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
