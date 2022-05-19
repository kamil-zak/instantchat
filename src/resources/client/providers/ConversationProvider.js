import React, { useContext, createContext, useState, useCallback } from 'react'
import { useMutation, useQuery, useSubscription } from '@apollo/client'
import PropTypes from 'prop-types'
import { getConversationId, setConversationData } from '../services/conversationService'
import { CREATE_CONVERSATION, GET_MESSAGES, GET_ONLY_MESSAGES, MESSAGE_SUB, SEND_MESSAGE } from '../apollo/queries'
import chatBoxConfig from '../services/configService'

const ConversationContext = createContext(null)

export const useConversation = () => {
    return useContext(ConversationContext)
}

const ConversationProvider = ({ children }) => {
    const [id, setId] = useState(getConversationId())

    const { data, fetchMore } = useQuery(GET_MESSAGES, {
        variables: { conversationId: id, limit: 7 },
        skip: !id,
    })
    const { messages = [], hasMore = false } = data?.getMessages || {}

    useSubscription(MESSAGE_SUB, {
        variables: { conversationId: id },
        skip: !id,
        onSubscriptionData: ({ client, subscriptionData }) => {
            const newMessage = subscriptionData.data?.newMessage
            if (!newMessage) return
            const data = { getMessages: { messages: [newMessage.message] } }
            client.writeQuery({ query: GET_ONLY_MESSAGES, data, variables: { conversationId: id } })
        },
    })

    const [createConversationMutate] = useMutation(CREATE_CONVERSATION, {
        variables: { chatId: chatBoxConfig.chatId },
        onCompleted: ({ createConversation: conversationData }) => {
            setId(conversationData.id)
            setConversationData(conversationData)
        },
    })

    const [sendMessageMutate] = useMutation(SEND_MESSAGE)

    const sendMessage = async (content) => {
        const conversationId = id || (await createConversationMutate()).data.createConversation.id
        await sendMessageMutate({ variables: { conversationId, content } })
    }

    const firstId = messages?.[0]?.id

    const getMore = useCallback(() => {
        if (!hasMore) return
        const variables = firstId ? { before: firstId } : {}
        fetchMore({ variables })
    }, [fetchMore, firstId, hasMore])

    const value = { messages, getMore, sendMessage }

    return <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>
}

ConversationProvider.propTypes = {
    children: PropTypes.node,
}

export default ConversationProvider
