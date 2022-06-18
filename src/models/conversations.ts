import { Model } from 'objection'
import Chat from './chat'
import Message from './message'

interface Conversation {
    id: number
    chatId: number
}

class Conversation extends Model {
    static tableName = 'conversations'

    static get relationMappings() {
        return {
            latestMessage: {
                relation: Model.HasOneRelation,
                modelClass: Message,
                filter: (query) => query.whereIn('id', Message.query().max('id').groupBy('conversationId')),
                join: {
                    from: 'conversations.id',
                    to: 'messages.conversation_id',
                },
            },
            chat: {
                relation: Model.HasOneRelation,
                modelClass: Chat,
                join: {
                    from: 'conversations.chat_id',
                    to: 'chats.id',
                },
            },
        }
    }
}

export default Conversation
