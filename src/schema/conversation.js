import { gql } from 'apollo-server-core'
import { withFilter } from 'graphql-subscriptions'
import Conversation from '../models/conversations.js'

export const conversationTypes = gql`
    type Query {
        getConversations(userId: ID!): [Conversation!]! @auth
    }

    type Mutation {
        isTyping(conversationId: ID!): Boolean @auth
    }

    type Subscription {
        isTypingWidget(conversationId: ID!): Boolean @auth
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
        getConversations: async (_, { userId }) => {
            const conversations = await Conversation.query()
                .withGraphJoined('[chat, latestMessage]')
                .where({ userId })
                .orderBy('latestMessage.time', 'desc')
            return conversations
        },
    },
    Mutation: {
        isTyping: async (_, { conversationId }, { pubsub }) => {
            pubsub.publish('IS_TYPING', { isTyping: true, conversationId })
        },
    },
    Subscription: {
        isTypingWidget: {
            subscribe: withFilter(
                (_, params, { pubsub }) => {
                    return pubsub.asyncIterator('IS_TYPING_WIDGET')
                },
                ({ conversationId }, args) => conversationId === args.conversationId
            ),
            resolve: (data) => data.isTypingWidget,
        },
    },
    Conversation: {
        unreadCount: async (parent, args, { unreadCountLoader }) => {
            return unreadCountLoader.load(parent.id)
        },
    },
}
