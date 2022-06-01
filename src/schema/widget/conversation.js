import { gql } from 'apollo-server-core'
import jwt from 'jsonwebtoken'
import { secrets } from '../../config/env.js'
import Conversation from '../../models/conversations.js'

export const conversationWidgetTypes = gql`
    type Mutation {
        createConversation(chatId: ID!): CreateConversationResponse
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
    },
}
