import { makeExecutableSchema } from '@graphql-tools/schema'
import { gql } from 'apollo-server-core'
import database from '../config/database.js'

const typeDefs = gql`
    type Query {
        getChats(id: Int!): [Chat!]!
    }

    type Subscription {
        test: Int
    }

    type Chat {
        name: String!
    }
`
const resolvers = {
    Query: {
        getChats: async (_, { id }) => {
            const chats = await database('chats').where({ user_id: id })
            return chats
        },
    },
    Subscription: {
        test: {
            subscribe: (_, args, { pubsub }) => pubsub.asyncIterator('INCREMENT'),
        },
    },
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

export default schema
