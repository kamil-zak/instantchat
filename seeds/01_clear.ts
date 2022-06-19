import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
    await knex('messages').del()
    await knex('conversations').del()
    await knex('chats').del()
    await knex('users').del()
}
