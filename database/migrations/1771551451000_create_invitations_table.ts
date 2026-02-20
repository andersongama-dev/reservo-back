import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'invitations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('invitation_id')
      table.enum('invitation_by', ['barber', 'barbershop']).notNullable()
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
      table.boolean('invitation_status').defaultTo(true)

      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
