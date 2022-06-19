import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('conversations', (table) => {
        table.increments('id').primary()
        table.integer('chat_id').unsigned()
        table.timestamp('created_at').defaultTo(knex.fn.now())

        table.foreign('chat_id').references('chats.id')
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('conversations')
}
