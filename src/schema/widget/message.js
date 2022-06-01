import { gql } from 'apollo-server-core'
import { withFilter } from 'graphql-subscriptions'
import Conversation from '../../models/conversations.js'
import Message from '../../models/message.js'

export const messageWidgetTypes = gql`
    type Query {
        getMessagesWidget(conversationId: ID!, before: ID, limit: Int = 10): MessagesResponse @auth(authBy: conversationId)
    }
    type Mutation {
        sendMessageWidget(conversationId: ID!, content: String!): Message! @auth(authBy: conversationId)
        markAsReadWidget(conversationId: ID!): Boolean @auth(authBy: conversationId)
    }
    type Subscription {
        newMessageWidget(conversationId: ID!): NewMessage! @auth(authBy: conversationId)
    }
`
export const messageWidgetResolvers = {
    Query: {
        getMessagesWidget: async (_, { conversationId, before, limit }) => {
            const messages = await Message.query().modify('formated', { conversationId, limit, before })
            messages.reverse()

            const hasMore = messages.length > limit
            if (hasMore) messages.splice(0, 1)

            return { hasMore, messages }
        },
    },
    Mutation: {
        sendMessageWidget: async (_, { conversationId, content }, { pubsub }) => {
            const { userId, chat } = await Conversation.query().findById(conversationId).select('userId').withGraphJoined('chat')
            const time = new Date()
            const isResponse = false
            const newMessageData = { conversationId, isResponse, content, time }
            const { id } = await Message.query().insert(newMessageData)

            pubsub.publish('NEW_MESSAGE', { message: { id, isResponse, content, time }, userId, chat, conversationId })

            return { id, ...newMessageData }
        },
        markAsReadWidget: async (_, { conversationId }) => {
            await Message.query().update({ read: true }).where({ conversationId, isResponse: true })
            return null
        },
    },
    Subscription: {
        newMessageWidget: {
            subscribe: withFilter(
                (_, params, { pubsub }) => {
                    return pubsub.asyncIterator('NEW_MESSAGE')
                },
                ({ conversationId }, args) => String(conversationId) === String(args.conversationId)
            ),
            resolve: (data) => data,
        },
    },
}
