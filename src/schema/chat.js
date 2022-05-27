import { gql } from 'apollo-server-core'
import Chat from '../models/chat.js'
import verifyAuthData from '../helpers/verifyAuthData.js'

export const chatTypes = gql`
    type Query {
        getChats(userId: ID!): [Chat!]! @auth
        getChat(chatId: ID!): Chat!
    }
    type Mutation {
        createChat(userId: ID!, details: ChatInput!): Chat! @auth
        updateChat(chatId: ID!, details: ChatInput!): Chat! @auth
        deleteChat(chatId: ID!): DeletedChat @auth
    }

    type Chat {
        id: ID!
        name: String!
        title: String!
        subtitle: String!
        color: String!
    }

    type DeletedChat {
        id: ID!
    }

    input ChatInput {
        name: String!
        title: String!
        subtitle: String!
        color: String!
    }
`
export const chatResolvers = {
    Query: {
        getChats: async (_, { userId }, { authData }) => {
            verifyAuthData(authData, { userId })
            const chats = await Chat.query().where({ userId })
            return chats
        },
        getChat: async (_, { chatId }) => {
            const chat = await Chat.query().findById(chatId)
            return chat
        },
    },
    Mutation: {
        createChat: async (_, { userId, details }, { authData }) => {
            verifyAuthData(authData, { userId })

            const { id } = await Chat.query().insert({ userId, ...details })
            return { ...details, id }
        },
        updateChat: async (_, { chatId, details }, { authData }) => {
            const { userId } = await Chat.query().findById(chatId).select('userId')
            verifyAuthData(authData, { userId })

            await Chat.query()
                .findById(chatId)
                .update({ ...details })

            return { ...details, id: chatId }
        },
        deleteChat: async (_, { chatId }, { authData }) => {
            const { userId } = await Chat.query().findById(chatId).select('userId')
            verifyAuthData(authData, { userId })
            await Chat.query().deleteById(chatId)
            return { id: chatId }
        },
    },
}
