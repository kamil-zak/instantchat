import { gql } from 'apollo-server-core'
import jwt from 'jsonwebtoken'
import { secrets } from '../config/env.js'
import verifyAuthData from '../utils/verifyAuthData.js'

export const conversationTypes = gql`
    type Query {
        getConversations(userId: ID!): [Conversation!]! @auth
    }
    type Mutation {
        createConversation(chatId: ID!): CreateConversationResponse
        markAsRead(conversationId: ID!): Boolean @auth
    }

    type CreateConversationResponse {
        id: ID!
        token: String!
    }

    type Conversation {
        id: ID!
        chat: Chat!
        unread: Boolean!
        latestMessage: Message!
    }
`
export const conversationResolvers = {
    Query: {
        getConversations: async (_, { userId }, { database, authData }) => {
            verifyAuthData(authData, { userId })

            const latestIds = database('messages').max('id').groupBy('conversation_id')
            const latestMessages = database('messages').whereIn('id', latestIds).as('latest')

            const conversations = await database('conversations')
                .select('latest.*', 'conversations.chat_id', 'conversations.unread', 'chats.name')
                .where({ user_id: userId })
                .join(latestMessages, 'conversations.id', 'latest.conversation_id')
                .join('chats', 'chats.id', 'conversations.chat_id')
                .orderBy('latest.time', 'desc')

            return conversations.map((m) => ({
                id: m.conversation_id,
                chat: { id: m.chat_id, name: m.name },
                unread: m.unread,
                latestMessage: { id: m.id, isResponse: m.is_response, content: m.content, time: m.time },
            }))
        },
    },
    Mutation: {
        createConversation: async (_, { chatId }, { database }) => {
            const [id] = await database('conversations').insert({ chat_id: chatId, unread: true })
            const token = jwt.sign({ conversationId: String(id) }, secrets.tokenSecret)
            return { token, id: String(id) }
        },
        markAsRead: async (_, { conversationId }, { database, authData }) => {
            const details = await database('conversations')
                .where('conversations.id', conversationId)
                .join('chats', 'chats.id', 'conversations.chat_id')
                .first()
            const userId = String(details?.user_id || '')
            verifyAuthData(authData, { userId })
            await database('conversations').where({ id: conversationId }).update({ unread: false })
            return true
        },
    },
}
