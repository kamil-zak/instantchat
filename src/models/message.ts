import { Model, Modifiers } from 'objection'
import { IMessage } from '../types/message'

interface Message extends IMessage {
    conversationId: number
    read: boolean
}

interface IFormatedConfig {
    conversationId: number
    limit: number
    before: number
}

class Message extends Model {
    static tableName = 'messages'

    static modifiers: Modifiers = {
        onlyLatest(builder) {
            builder.whereIn('id', Message.query().max('id').groupBy('conversation_id'))
        },
        limited(buildrer, { conversationId, limit, before }: IFormatedConfig) {
            buildrer
                .where({ conversationId })
                .orderBy('time', 'desc')
                .limit(limit + 1)
                .modify((builder) => {
                    if (before) builder.andWhere('id', '<', before)
                })
        },
    }
}

export default Message
