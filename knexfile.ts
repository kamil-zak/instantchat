import 'dotenv/config'
import type { Knex } from 'knex'
import { knexSnakeCaseMappers } from 'objection'

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

const databaseConfig = {
    host: DB_HOST || 'localhost',
    port: DB_PORT || 3306,
    user: DB_USER || 'root',
    password: DB_PASSWORD || '',
    database: DB_NAME || 'instantchat',
}

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'mysql2',
        connection: databaseConfig,
        ...knexSnakeCaseMappers(),
    },
}

export default config
