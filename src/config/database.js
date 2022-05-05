import knex from 'knex'
import { databaseConfig } from './env.js'

const database = knex({
    client: 'mysql2',
    connection: databaseConfig,
})

export default database
