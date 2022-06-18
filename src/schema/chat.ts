import { gql } from 'apollo-server-core'
import { createChat, deleteChat, getChatById, getChatByUserId, updateChat } from '../services/chat'
import { IChatResolvers } from '../types/chat'

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
export const chatResolvers: IChatResolvers = {
    Query: {
        getChats: async (_, { userId }) => {
            const chats = await getChatByUserId(userId)
            return chats
        },
        getChat: async (_, { chatId }) => {
            const chat = await getChatById(chatId)
            return chat
        },
    },
    Mutation: {
        createChat: async (_, { userId, details }) => {
            const chat = await createChat({ userId, details })
            return chat
        },
        updateChat: async (_, { chatId, details }) => {
            const chat = await updateChat({ chatId, details })
            return chat
        },
        deleteChat: async (_, { chatId }) => {
            await deleteChat(chatId)
            return { id: Number(chatId) }
        },
    },
}
