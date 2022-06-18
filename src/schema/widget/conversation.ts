import { gql } from 'apollo-server-core'
import { withFilter } from 'graphql-subscriptions'
import jwt from 'jsonwebtoken'
import { secrets } from '../../config/env'
import { createConversation } from '../../services/conversation'
import { IConversationWidgetResolvers, IIsTypingArgs, IIsTypingData, IIsTypingWidgetData } from '../../types/conversation'
import { IWSContext } from '../../types/graphql'

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
export const conversationWidgetResolvers: IConversationWidgetResolvers = {
    Mutation: {
        createConversation: async (_, { chatId }) => {
            const conversationId = await createConversation(chatId)
            const token = jwt.sign({ conversationId }, secrets.tokenSecret)
            return { token, id: conversationId }
        },
        isTypingWidget: async (_, { conversationId }, { pubsub }) => {
            const pubsubData: IIsTypingWidgetData = { isTypingWidget: true, conversationId: Number(conversationId) }
            pubsub.publish('IS_TYPING_WIDGET', pubsubData)
        },
    },
    Subscription: {
        isTyping: {
            subscribe: withFilter(
                (_, params, { pubsub }: IWSContext) => {
                    return pubsub.asyncIterator('IS_TYPING')
                },
                ({ conversationId }: IIsTypingData, args: IIsTypingArgs) => conversationId === Number(args.conversationId)
            ),
            resolve: (data) => data.isTyping,
        },
    },
}
