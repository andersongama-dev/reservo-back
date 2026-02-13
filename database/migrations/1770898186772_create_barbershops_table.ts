import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'barbershops'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('barbershop_id')
      table.string('barbershop_name')
      table.boolean('barbershop_status')
      table.string('invitation_code').notNullable().unique()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
