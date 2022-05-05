import { gql } from 'apollo-server-core'

export const conversationTypes = gql`
    type Query {
        getConversations(chatId: Int!): [Conversation!]!
    }
    type Mutation {
        createConversation(chatId: Int!): CreateConversationResponse
    }

    type CreateConversationResponse {
        id: Int!
    }

    type Conversation {
        id: Int!
        latestMessage: Message!
    }
`
export const conversationResolvers = {
    Query: {
        getConversations: async (_, { chatId }, { database }) => {
            const latestIds = database('messages').max('id').groupBy('conversation_id')
            const latestMessages = database('messages').whereIn('id', latestIds).as('latest')
            const conversations = await database('conversations')
                .select('latest.*')
                .where({ chat_id: chatId })
                .join(latestMessages, 'conversations.id', 'latest.conversation_id')
                .orderBy('latest.time', 'desc')
            const mappedConversations = conversations.map((m) => ({
                id: m.conversation_id,
                latestMessage: { id: m.id, isResponse: m.is_response, content: m.content, time: m.time },
            }))
            return mappedConversations
        },
    },
    Mutation: {
        createConversation: async (_, { chatId }, { database }) => {
            const resp = await database('conversations').insert({
                chat_id: chatId,
            })
            return { id: resp[0] }
        },
    },
}
