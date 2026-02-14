import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'services'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('service_id')
      table.string('service_name')
      table.integer('service_duration').unsigned()
      table.decimal('service_price').unsigned()
      table
        .integer('barbershop_id')
        .references('barbershop_id')
        .inTable('barbershops')
        .unsigned()
        .onDelete('CASCADE')
      table
        .integer('barber_id')
        .references('barber_id')
        .inTable('barbers')
        .unsigned()
        .onDelete('CASCADE')
      table.boolean('service_status').defaultTo(true)

      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
