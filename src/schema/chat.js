import { gql } from 'apollo-server-core'
import verifyAuthData from '../utils/verifyAuthData.js'

export const chatTypes = gql`
    type Query {
        getChats(userId: ID!): [Chat!]! @auth
    }
    type Mutation {
        createChat(userId: ID!, name: String!): Chat @auth
    }

    type Chat {
        id: ID!
        name: String!
    }
`
export const chatResolvers = {
    Query: {
        getChats: async (_, { userId }, { database, authData }) => {
            verifyAuthData(authData, { userId })
            const chats = await database('chats').where({ user_id: userId })
            return chats
        },
    },
    Mutation: {
        createChat: async (_, { userId, name }, { database, authData }) => {
            verifyAuthData(authData, { userId })

            const id = await database('chats').insert({ user_id: userId, name }).fisrt()
            return { id, name }
        },
    },
}
