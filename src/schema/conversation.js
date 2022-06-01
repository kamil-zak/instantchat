import { gql } from 'apollo-server-core'
import Conversation from '../models/conversations.js'

export const conversationTypes = gql`
    type Query {
        getConversations(userId: ID!): [Conversation!]! @auth
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
    Conversation: {
        unreadCount: async (parent, args, { unreadCountLoader }) => {
            return unreadCountLoader.load(parent.id)
        },
    },
}
