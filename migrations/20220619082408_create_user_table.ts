import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary()
        table.string('email').unique().notNullable()
        table.string('password').notNullable()
        table.boolean('is_active').defaultTo(false)
        table.timestamp('created_at').defaultTo(knex.fn.now())
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users')
}
