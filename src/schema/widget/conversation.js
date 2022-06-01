import { gql } from 'apollo-server-core'
import { withFilter } from 'graphql-subscriptions'
import jwt from 'jsonwebtoken'
import { secrets } from '../../config/env.js'
import Conversation from '../../models/conversations.js'

export const conversationWidgetTypes = gql`
    type Mutation {
        createConversation(chatId: ID!): CreateConversationResponse
        isTypingWidget(conversationId: ID!): Boolean @auth(authBy: conversationId)
    }

    type Subscription {
        isTyping(conversationId: ID!): Boolean @auth(authBy: conversationId)
    }

    type CreateConversationResponse {
        id: ID!
        token: String!
    }
`
export const conversationWidgetResolvers = {
    Mutation: {
        createConversation: async (_, { chatId }) => {
            const conversation = await Conversation.query().insert({ chatId })
            const conversationId = String(conversation.id)
            const token = jwt.sign({ conversationId }, secrets.tokenSecret)
            return { token, id: conversationId }
        },
        isTypingWidget: async (_, { conversationId }, { pubsub }) => {
            pubsub.publish('IS_TYPING_WIDGET', { isTypingWidget: true, conversationId })
        },
    },
    Subscription: {
        isTyping: {
            subscribe: withFilter(
                (_, params, { pubsub }) => {
                    return pubsub.asyncIterator('IS_TYPING')
                },
                ({ conversationId }, args) => conversationId === args.conversationId
            ),
            resolve: (data) => data.isTyping,
        },
    },
}
