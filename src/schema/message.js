import { gql } from 'apollo-server-core'
import { withFilter } from 'graphql-subscriptions'

export const messageTypes = gql`
    type Query {
        getMessages(conversationId: Int!): [Message!]!
    }
    type Mutation {
        sendMessage(content: String!, conversationId: Int!, isResponse: Boolean = false): SendMessageResponse
    }
    type Subscription {
        newMessage(conversationId: Int!): Message!
    }

    type SendMessageResponse {
        id: Int!
    }
    type Message {
        id: Int!
        isResponse: Boolean!
        content: String!
        time: String!
    }
`
export const messageResolvers = {
    Query: {
        getMessages: async (_, { conversationId }, { database }) => {
            const messages = await database('messages')
                .select({ id: 'id', isResponse: 'is_response', content: 'content', time: 'time' })
                .where({ conversation_id: conversationId })
            return messages
        },
    },
    Mutation: {
        sendMessage: async (_, { conversationId, isResponse, content }, { database, pubsub }) => {
            const resp = await database('messages').insert({
                conversation_id: conversationId,
                is_response: isResponse,
                content,
                time: new Date(),
            })
            const id = resp[0]
            pubsub.publish('NEW_MESSAGE', { newMessage: { id, isResponse, content, conversationId } })
            return { id }
        },
    },
    Subscription: {
        newMessage: {
            subscribe: withFilter(
                (_, args, { pubsub }) => pubsub.asyncIterator('NEW_MESSAGE'),
                ({ newMessage }, args) => {
                    return newMessage.conversationId === args.conversationId
                }
            ),
        },
    },
    Message: {
        time: (parent) => parent.time.toISOString(),
    },
}
