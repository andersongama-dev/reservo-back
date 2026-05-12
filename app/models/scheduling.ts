import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Service from './service.js'
import User from './user.js'
import Barber from './barber.js'
import Barbershop from './barbershop.js'

export default class Scheduling extends BaseModel {
  @column({ isPrimary: true, columnName: 'scheduling_id' })
  declare scheduling_id: number

  @column()
  declare scheduling_date: DateTime

  @column()
  declare service_id: number

  @column()
  declare user_id: number

  @column()
  declare barber_id: number

  @column()
  declare barbershop_id: number

  @belongsTo(() => Service, {
    foreignKey: 'service_id',
  })
  declare service: BelongsTo<typeof Service>

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Barber, {
    foreignKey: 'barber_id',
  })
  declare barber: BelongsTo<typeof Barber>

  @belongsTo(() => Barbershop, {
    foreignKey: 'barbershop_id',
  })
  declare barbershop: BelongsTo<typeof Barbershop>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
