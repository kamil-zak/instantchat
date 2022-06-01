import { gql } from 'apollo-server-core'
import { withFilter } from 'graphql-subscriptions'
import Message from '../models/message.js'

export const messageTypes = gql`
    type Query {
        getMessages(conversationId: ID!, before: ID, limit: Int = 10): MessagesResponse @auth
    }
    type Mutation {
        sendMessage(conversationId: ID!, content: String!): Message! @auth
        markAsRead(conversationId: ID!): Boolean @auth
    }
    type Subscription {
        newMessage(userId: ID!): NewMessage! @auth
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
        getMessages: async (_, { conversationId, before, limit }) => {
            const messages = await Message.query().modify('formated', { conversationId, limit, before })
            messages.reverse()

            const hasMore = messages.length > limit
            if (hasMore) messages.splice(0, 1)

            return { hasMore, messages }
        },
    },
    Mutation: {
        sendMessage: async (_, { conversationId, content }, { pubsub, userId, chat }) => {
            const time = new Date()
            const isResponse = true
            const newMessageData = { conversationId, isResponse, content, time }
            const { id } = await Message.query().insert(newMessageData)

            pubsub.publish('NEW_MESSAGE', { message: { id, isResponse, content, time }, userId, chat, conversationId })

            return { id, ...newMessageData }
        },
        markAsRead: async (_, { conversationId }) => {
            await Message.query().update({ read: true }).where({ conversationId, isResponse: false })
            return null
        },
    },
    Subscription: {
        newMessage: {
            subscribe: withFilter(
                (_, params, { pubsub }) => {
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
