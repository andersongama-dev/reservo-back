import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'schedulings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('scheduling_id')
      table.dateTime('scheduling_date')
      table
        .integer('service_id')
        .references('service_id')
        .inTable('services')
        .unsigned()
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('user_id')
        .references('user_id')
        .inTable('users')
        .unsigned()
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('barber_id')
        .references('barber_id')
        .inTable('barbers')
        .unsigned()
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('barbershop_id')
        .references('barbershop_id')
        .inTable('barbershops')
        .unsigned()
        .onDelete('CASCADE')

      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
