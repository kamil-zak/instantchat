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
        }
    }
}

export default Message
