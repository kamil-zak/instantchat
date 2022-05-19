import chatBoxConfig from './configService'

const ID = `conversationId:${chatBoxConfig.chatId}`
const TOKEN = `conversationToken:${chatBoxConfig.chatId}`

export const getConversationId = () => {
    return localStorage.getItem(ID)
}

export const getConversationToken = () => {
    return localStorage.getItem(TOKEN)
}

export const setConversationData = ({ id, token }) => {
    localStorage.setItem(ID, id)
    localStorage.setItem(TOKEN, token)
}

export const clearConversationData = () => {
    localStorage.removeItem(ID)
    localStorage.removeItem(TOKEN)
}
