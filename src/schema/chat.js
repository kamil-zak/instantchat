import { gql } from 'apollo-server-core'
import Chat from '../models/chat.js'
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
        getChats: async (_, { userId }, { authData }) => {
            verifyAuthData(authData, { userId })
            const chats = await Chat.query().where({ userId })
            return chats
        },
    },
    Mutation: {
        createChat: async (_, { userId, name }, { authData }) => {
            verifyAuthData(authData, { userId })

            const { id } = await Chat.query().insert({ userId, name })
            return { id, name }
        },
    },
}
