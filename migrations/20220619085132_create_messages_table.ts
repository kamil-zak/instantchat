import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('messages', (table) => {
        table.increments('id').primary()
        table.integer('conversation_id').unsigned()
        table.string('content').notNullable()
        table.boolean('is_response').notNullable()
        table.boolean('read').notNullable().defaultTo(false)
        table.timestamp('time').defaultTo(knex.fn.now())

        table.foreign('conversation_id').references('conversations.id')
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('messages')
}
