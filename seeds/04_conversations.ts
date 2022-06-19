import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
    await knex('conversations').insert([
        { id: 1, chatId: 1 },
        { id: 2, chatId: 1 },
        { id: 3, chatId: 2 },
        { id: 4, chatId: 2 },
    ])
}
