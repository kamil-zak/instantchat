import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
    await knex('users').insert([{ id: 1, email: 'admin@kamilzak.pl', password: 'test', isActive: true }])
}
