import { gql } from 'apollo-server-core'
import database from '../config/database.js'

export const chatTypes = gql`
    type Query {
        getChats(id: Int!): [Chat!]!
    }

    type Chat {
        name: String!
    }
`
export const chatResolvers = {
    Query: {
        getChats: async (_, { id }) => {
            const chats = await database('chats').where({ user_id: id })
            return chats
        },
    },
}
