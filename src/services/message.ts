import { PubSub } from 'graphql-subscriptions'
import Chat from '../models/chat'
import Conversation from '../models/conversations'
import Message from '../models/message'
import { INewMessageData } from '../types/message'

interface IGetLimitedMessagesConfig {
    conversationId: number | string
    before: number | string
    limit: number
}

export const getLimitedMessages = async ({ conversationId, limit, before }: IGetLimitedMessagesConfig) => {
    const messages = await Message.query().modify('limited', { conversationId, limit, before })
    messages.reverse()

    const hasMore = messages.length > limit
    if (hasMore) messages.splice(0, 1)

    return { hasMore, messages }
}

interface ISendMessageConfig {
    conversationId: string | number
    content: string
    isResponse: boolean
    pubsub: PubSub
}

export const sendMessage = async ({ conversationId, content, isResponse, pubsub }: ISendMessageConfig) => {
    const { userId, chat } = await Conversation.query()
        .findById(conversationId)
        .select('userId')
        .withGraphJoined('chat')
        .castTo<{ userId: number; chat: Chat }>()
    const time = new Date()
    const newMessageData = { conversationId: Number(conversationId), isResponse, content, time }
    const { id } = await Message.query().insert(newMessageData)

    const pubsubData: INewMessageData = { message: { id, isResponse, content, time }, userId, chat, conversationId: Number(conversationId) }
    pubsub.publish('NEW_MESSAGE', pubsubData)

    return { id, read: false, ...newMessageData }
}

interface IMarkMessagesAsReadConfig {
    conversationId: string | number
    isResponse: boolean
}

export const markMessagesAsRead = async ({ conversationId, isResponse }: IMarkMessagesAsReadConfig) => {
    await Message.query().update({ read: true }).where({ conversationId, isResponse })
}
