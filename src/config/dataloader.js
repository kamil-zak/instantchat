import Message from '../models/message.js'

export const batchUnreadCount = async (ids) => {
    const conversations = await Message.query()
        .select('conversationId as id')
        .count('* as count')
        .groupBy('conversationId')
        .where({ read: false, isResponse: false })
        .whereIn('conversationId', ids)
    return ids.map((id) => conversations.find((x) => String(x.id) === String(id))?.count || 0)
}
