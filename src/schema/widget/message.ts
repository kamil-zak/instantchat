import { gql } from 'apollo-server-core'
import { withFilter } from 'graphql-subscriptions'
import { getLimitedMessages, markMessagesAsRead, sendMessage } from '../../services/message'
import { IWSContext } from '../../types/graphql'
import { IMessageWidgetResolvers, INewMessageData, INewMessageWidgetArgs } from '../../types/message'

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
export const messageWidgetResolvers: IMessageWidgetResolvers = {
    Query: {
        getMessagesWidget: async (_, { conversationId, before, limit }) => {
            const messages = await getLimitedMessages({ conversationId, before, limit })
            return messages
        },
    },
    Mutation: {
        sendMessageWidget: async (_, { conversationId, content }, { pubsub }) => {
            const isResponse = false
            const message = await sendMessage({ conversationId, content, isResponse, pubsub })
            return message
        },
        markAsReadWidget: async (_, { conversationId }) => {
            await markMessagesAsRead({ conversationId, isResponse: true })
            return null
        },
    },
    Subscription: {
        newMessageWidget: {
            subscribe: withFilter(
                (_, params, { pubsub }: IWSContext) => {
                    return pubsub.asyncIterator('NEW_MESSAGE')
                },
                ({ conversationId }: INewMessageData, args: INewMessageWidgetArgs) => conversationId === Number(args.conversationId)
            ),
            resolve: (data) => data,
        },
    },
}
