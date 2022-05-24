import { gql } from 'apollo-server-core'
import jwt from 'jsonwebtoken'
import { secrets } from '../config/env.js'
import Conversation from '../models/conversations.js'
import verifyAuthData from '../helpers/verifyAuthData.js'

export const conversationTypes = gql`
    type Query {
        getConversations(userId: ID!): [Conversation!]! @auth
    }
    type Mutation {
        createConversation(chatId: ID!): CreateConversationResponse
    }

    type CreateConversationResponse {
        id: ID!
        token: String!
    }

    type Conversation {
        id: ID!
        chat: Chat!
        unreadCount: Int!
        latestMessage: Message!
    }
`
export const conversationResolvers = {
    Query: {
        getConversations: async (_, { userId }, { authData }) => {
            verifyAuthData(authData, { userId })

            const conversations = await Conversation.query()
                .withGraphJoined('[chat, latestMessage]')
                .where({ userId })
                .orderBy('latestMessage.time', 'desc')
            return conversations
        },
    },
    Mutation: {
        createConversation: async (_, { chatId }) => {
            const conversation = await Conversation.query().insert({ chatId })
            const conversationId = String(conversation.id)
            const token = jwt.sign({ conversationId }, secrets.tokenSecret)
            return { token, id: conversationId }
        },
    },
    Conversation: {
        unreadCount: async (parent, args, { unreadCountLoader }) => {
            return unreadCountLoader.load(parent.id)
        },
    },
}
