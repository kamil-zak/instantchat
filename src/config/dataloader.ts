import Message from '../models/message'

export const batchUnreadCount = async (ids: number[]) => {
    const conversations = await Message.query()
        .select('conversationId as id')
        .count('* as count')
        .groupBy('conversationId')
        .where({ read: false, isResponse: false })
        .whereIn('conversationId', ids)
        .castTo<{ id: number; count: number }[]>()

    const values = ids.map((id) => conversations.find((x) => x.id === id)?.count || 0)
    return values
}
