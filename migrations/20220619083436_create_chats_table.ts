import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('chats', (table) => {
        table.increments('id').primary()
        table.integer('user_id').unsigned()
        table.string('name').notNullable()
        table.string('title').notNullable()
        table.string('subtitle').notNullable()
        table.string('color').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now())

        table.foreign('user_id').references('users.id')
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('chats')
}
