import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('user_id')
      table.string('user_name').nullable()
      table.string('user_email', 254).notNullable().unique()
      table.string('user_password').notNullable()
      table.enum('user_role', ['barber', 'customer']).notNullable().defaultTo('customer')
      table.boolean('user_status').notNullable().defaultTo(true)
      table.boolean('onboarding_completed').defaultTo(false)

      table.timestamps(true, true)
    })
  }
  async down() {
    this.schema.dropTable(this.tableName)
  }
}
