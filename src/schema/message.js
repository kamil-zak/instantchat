import { gql } from 'apollo-server-core'
import { withFilter } from 'graphql-subscriptions'
import Conversation from '../models/conversations.js'
import Message from '../models/message.js'
import verifyAuthData from '../helpers/verifyAuthData.js'

export const messageTypes = gql`
    type Query {
        getMessages(conversationId: ID!, before: ID, limit: Int = 10): MessagesResponse @auth
    }
    type Mutation {
        sendMessage(conversationId: ID!, content: String!, isResponse: Boolean = false): ID! @auth
        markAsRead(conversationId: ID!, isResponse: Boolean = false): Boolean @auth
    }
    type Subscription {
        newConversationMessage(conversationId: ID!): NewMessage! @auth
        newUserMessage(userId: ID!): NewMessage! @auth
    }

    type MessagesResponse {
        hasMore: Boolean!
        messages: [Message!]!
    }

    type Message {
        id: ID!
        isResponse: Boolean!
        content: String!
        time: String!
    }

    type NewMessage {
        chat: Chat!
        conversationId: ID!
        message: Message!
    }
`
export const messageResolvers = {
    Query: {
        getMessages: async (_, { conversationId, before, limit }, { authData }) => {
            const { userId } = await Conversation.query().findById(conversationId).select('userId').joinRelated('chat')
            verifyAuthData(authData, { userId, conversationId })

            const messages = await Message.query()
                .where({ conversationId })
                .orderBy('time', 'desc')
                .limit(limit + 1)
                .modify((builder) => {
                    if (before) builder.andWhere('id', '<', before)
                })
            messages.reverse()

            const hasMore = messages.length > limit
            if (hasMore) messages.splice(0, 1)

            return { hasMore, messages }
        },
    },
    Mutation: {
        sendMessage: async (_, { conversationId, content, isResponse }, { pubsub, authData }) => {
            const { userId, chat } = await Conversation.query().findById(conversationId).select('userId').withGraphJoined('chat')
            if (isResponse) verifyAuthData(authData, isResponse ? { userId } : { conversationId })

            const time = new Date()
            const { id } = await Message.query().insert({ conversationId, isResponse, content, time })

            pubsub.publish('NEW_MESSAGE', { message: { id, isResponse, content, time }, userId, chat, conversationId })

            return id
        },
        markAsRead: async (_, { conversationId, isResponse }, { authData }) => {
            const userIdQuery = Conversation.query().findById(conversationId).select('userId').joinRelated('chat')
            verifyAuthData(authData, isResponse ? { conversationId } : await userIdQuery)
            await Message.query().update({ read: true }).where({ conversationId, isResponse })
            return null
        },
    },
    Subscription: {
        newConversationMessage: {
            subscribe: withFilter(
                (_, { conversationId }, { pubsub, authData }) => {
                    verifyAuthData(authData, { conversationId })
                    return pubsub.asyncIterator('NEW_MESSAGE')
                },
                ({ conversationId }, args) => String(conversationId) === String(args.conversationId)
            ),
            resolve: (data) => data,
        },
        newUserMessage: {
            subscribe: withFilter(
                (_, { userId }, { pubsub, authData }) => {
                    verifyAuthData(authData, { userId })
                    return pubsub.asyncIterator('NEW_MESSAGE')
                },
                ({ userId }, args) => String(userId) === String(args.userId)
            ),
            resolve: (data) => data,
        },
    },
    Message: {
        time: (parent) => parent.time.toISOString(),
    },
}
