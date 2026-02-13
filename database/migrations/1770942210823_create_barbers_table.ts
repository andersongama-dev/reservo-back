import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'barbers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('barber_id')
      table
        .integer('user_id')
        .references('user_id')
        .inTable('users')
        .unsigned()
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('barbershop_id')
        .references('barbershop_id')
        .inTable('barbershops')
        .unsigned()
        .onDelete('CASCADE')

      table.string('barber_function').notNullable()
      table.string('invitation_code').notNullable().unique()

      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
