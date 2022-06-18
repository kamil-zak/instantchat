import { gql } from 'apollo-server-core'
import { withFilter } from 'graphql-subscriptions'
import { getConversationsByUser } from '../services/conversation'
import { IConversationResolvers, IIsTypingData, IIsTypingWidgetArgs, IIsTypingWidgetData } from '../types/conversation'
import { IWSContext } from '../types/graphql'

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
export const conversationResolvers: IConversationResolvers = {
    Query: {
        getConversations: async (_, { userId }) => {
            const conversations = await getConversationsByUser(userId)
            return conversations
        },
    },
    Mutation: {
        isTyping: async (_, { conversationId }, { pubsub }) => {
            const pubsubData: IIsTypingData = { isTyping: true, conversationId: Number(conversationId) }
            pubsub.publish('IS_TYPING', pubsubData)
        },
    },
    Subscription: {
        isTypingWidget: {
            subscribe: withFilter(
                (_, params, { pubsub }: IWSContext) => {
                    return pubsub.asyncIterator('IS_TYPING_WIDGET')
                },
                ({ conversationId }: IIsTypingWidgetData, args: IIsTypingWidgetArgs) => conversationId === Number(args.conversationId)
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
