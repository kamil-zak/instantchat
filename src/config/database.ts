import knexConfig from 'knex'
import { knexSnakeCaseMappers, Model } from 'objection'
import { databaseConfig } from './env'

Model.useLimitInFirst = true

const knex = knexConfig({
    client: 'mysql2',
    connection: databaseConfig,
    ...knexSnakeCaseMappers(),
})

Model.knex(knex)
