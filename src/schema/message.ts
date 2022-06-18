import { gql } from 'apollo-server-core'
import { withFilter } from 'graphql-subscriptions'
import { getLimitedMessages, markMessagesAsRead, sendMessage } from '../services/message'
import { IWSContext } from '../types/graphql'
import { IMessageResolvers, INewMessageArgs, INewMessageData } from '../types/message'

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

export const messageResolvers: IMessageResolvers = {
    Query: {
        getMessages: async (_, { conversationId, before, limit }) => {
            const messages = await getLimitedMessages({ conversationId, before, limit })
            return messages
        },
    },
    Mutation: {
        sendMessage: async (_, { conversationId, content }, { pubsub }) => {
            const isResponse = true
            const message = await sendMessage({ conversationId, content, isResponse, pubsub })
            return message
        },
        markAsRead: async (_, { conversationId }) => {
            await markMessagesAsRead({ conversationId, isResponse: false })
            return null
        },
    },
    Subscription: {
        newMessage: {
            subscribe: withFilter(
                (_, params, { pubsub }: IWSContext) => {
                    return pubsub.asyncIterator('NEW_MESSAGE')
                },
                ({ userId }: INewMessageData, args: INewMessageArgs) => userId === Number(args.userId)
            ),
            resolve: (data) => data,
        },
    },
    Message: {
        time: async (parent) => parent.time.toISOString(),
    },
}
