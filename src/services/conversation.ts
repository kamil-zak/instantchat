import Conversation from '../models/conversations'
import { IConversationData } from '../types/conversation'

export const getConversationsByUser = async (id: string | number) => {
    const conversations = await Conversation.query()
        .withGraphJoined('[chat, latestMessage]')
        .where({ userId: id })
        .orderBy('latestMessage.time', 'desc')
        .castTo<IConversationData[]>()
    return conversations
}

export const createConversation = async (id: string | number) => {
    const conversation = await Conversation.query().insert({ chatId: Number(id) })
    return conversation.id
}

export const getConversationUser = async (id: string | number) => {
    const { userId } = await Conversation.query().findById(id).joinRelated('chat').select('userId').castTo<{ userId: number }>()
    return userId
}
