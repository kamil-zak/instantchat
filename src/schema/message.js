import { gql } from 'apollo-server-core'
import { withFilter } from 'graphql-subscriptions'
import verifyAuthData from '../utils/verifyAuthData.js'

const getConversationDetails = async (conversationId, database) => {
    const details = await database('conversations')
        .select({ userId: 'chats.user_id', chatId: 'chats.id', chatName: 'chats.name' })
        .leftJoin('chats', 'chats.id', 'conversations.chat_id')
        .where({ 'conversations.id': conversationId })
        .first()
    const chat = { id: String(details.chatId), name: details.chatName }
    return { userId: String(details.userId), chat }
}

export const messageTypes = gql`
    type Query {
        getMessages(conversationId: ID!, before: ID, limit: Int = 10): MessagesResponse @auth
    }
    type Mutation {
        sendMessage(conversationId: ID!, content: String!): ID! @auth
        sendResponse(conversationId: ID!, content: String!): ID! @auth
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
        getMessages: async (_, { conversationId, before, limit }, { database, authData }) => {
            const { userId } = await getConversationDetails(conversationId, database)
            verifyAuthData(authData, { userId, conversationId })

            let selectedMessages = database('messages')
                .select({ id: 'id', isResponse: 'is_response', content: 'content', time: 'time' })
                .where({ conversation_id: conversationId })
                .orderBy('time', 'desc')
                .limit(limit + 1)
                .as('selected_messages')
            if (before) selectedMessages = selectedMessages.andWhere('id', '<', before)
            const messages = await database(selectedMessages).orderBy('time')

            const hasMore = messages.length > limit
            if (hasMore) messages.splice(0, 1)

            return { hasMore, messages }
        },
    },
    Mutation: {
        sendMessage: async (_, { conversationId, content }, { database, pubsub, authData }) => {
            verifyAuthData(authData, { conversationId })

            const { userId, chat } = await getConversationDetails(conversationId, database)
            const time = new Date()
            const [id] = await database('messages').insert({
                conversation_id: conversationId,
                is_response: false,
                content,
                time,
            })

            await database('conversations').where({ id: conversationId }).update({ unread: true })
            pubsub.publish('NEW_MESSAGE', { message: { id, isResponse: false, content, time }, userId, chat, conversationId })
            return id
        },
        sendResponse: async (_, { conversationId, content }, { database, pubsub, authData }) => {
            const { userId, chat } = await getConversationDetails(conversationId, database)
            verifyAuthData(authData, { userId })

            const time = new Date()

            const [id] = await database('messages').insert({
                conversation_id: conversationId,
                is_response: true,
                content,
                time,
            })

            pubsub.publish('NEW_MESSAGE', { message: { id, isResponse: true, content, time }, userId, chat, conversationId })

            return id
        },
    },
    Subscription: {
        newConversationMessage: {
            subscribe: withFilter(
                (_, { conversationId }, { pubsub, authData }) => {
                    verifyAuthData(authData, { conversationId })

                    return pubsub.asyncIterator('NEW_MESSAGE')
                },
                ({ conversationId }, args) => conversationId === args.conversationId
            ),
            resolve: (data) => data,
        },
        newUserMessage: {
            subscribe: withFilter(
                (_, { userId }, { pubsub, authData }) => {
                    verifyAuthData(authData, { userId })
                    return pubsub.asyncIterator('NEW_MESSAGE')
                },
                ({ userId }, args) => userId === args.userId
            ),
            resolve: (data) => data,
        },
    },
    Message: {
        time: (parent) => parent.time.toISOString(),
    },
}
