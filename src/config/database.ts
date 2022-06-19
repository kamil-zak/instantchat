import knexConfig from 'knex'
import { Model } from 'objection'
import config from '../../knexfile'

Model.useLimitInFirst = true

const knex = knexConfig(config.development)

Model.knex(knex)
