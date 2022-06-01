import { Model } from 'objection'

class Message extends Model {
    static get tableName() {
        return 'messages'
    }

    static get modifiers() {
        return {
            onlyLatest(builder) {
                builder.whereIn('id', Message.query().max('id').groupBy('conversation_id'))
            },
            formated(buildrer, { conversationId, limit, before }) {
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
}

export default Message
