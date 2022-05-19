import { gql } from '@apollo/client'

export const GET_MESSAGES = gql`
    query getMessages($conversationId: ID!, $before: ID, $limit: Int) {
        getMessages(conversationId: $conversationId, before: $before, limit: $limit) {
            hasMore
            messages {
                content
                id
                isResponse
                time
            }
        }
    }
`

export const MESSAGE_SUB = gql`
    subscription ($conversationId: ID!) {
        newMessage: newConversationMessage(conversationId: $conversationId) {
            message {
                id
                isResponse
                content
                time
            }
        }
    }
`

export const CREATE_CONVERSATION = gql`
    mutation ($chatId: ID!) {
        createConversation(chatId: $chatId) {
            id
            token
        }
    }
`

export const SEND_MESSAGE = gql`
    mutation ($content: String!, $conversationId: ID!) {
        sendMessage(content: $content, conversationId: $conversationId)
    }
`

export const GET_ONLY_MESSAGES = gql`
    query getMessages($conversationId: ID!) {
        getMessages(conversationId: $conversationId) {
            messages {
                id
                isResponse
                time
                content
            }
        }
    }
`
