import Chat from '../models/chat'
import { IChatDetails } from '../types/chat'

export const getChatByUserId = (id: string | number) => Chat.query().where({ userId: id })
export const getChatById = (id: string | number) => Chat.query().findById(id)

interface ICreateChatConfig {
    userId: string | number
    details: IChatDetails
}

export const createChat = async ({ userId, details }: ICreateChatConfig) => {
    const { id } = await Chat.query().insert({ userId: Number(userId), ...details })
    return { id, ...details }
}

interface IUpdateChatConfig {
    chatId: string | number
    details: IChatDetails
}

export const updateChat = async ({ chatId, details }: IUpdateChatConfig) => {
    await Chat.query()
        .findById(chatId)
        .update({ ...details })

    return { id: Number(chatId), ...details }
}

export const deleteChat = (id: string | number) => Chat.query().deleteById(id)

export const getChatUser = async (id: string | number) => {
    const { userId } = await Chat.query().findById(id).select('userId')
    return userId
}
