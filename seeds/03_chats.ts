import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
    await knex('chats').insert([
        { id: 1, userId: 1, name: 'instant', title: 'Instantchat', subtitle: 'Contact us!', color: '#790729' },
        { id: 2, userId: 1, name: 'company', title: 'Company', subtitle: '', color: '#445dc0' },
    ])
}
