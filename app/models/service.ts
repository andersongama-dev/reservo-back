import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  declare service_id: number

  @column()
  declare service_name: string

  @column()
  declare service_duration: number

  @column()
  declare service_price: number

  @column()
  declare barbershop_id: number

  @column()
  declare barber_id: number

  @column()
  declare service_status: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
