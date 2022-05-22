import knexConfig from 'knex'
import { knexSnakeCaseMappers, Model } from 'objection'
import { databaseConfig } from './env.js'

Model.useLimitInFirst = true

const knex = knexConfig({
    client: 'mysql2',
    connection: databaseConfig,
    ...knexSnakeCaseMappers(),
})

Model.knex(knex)
