import { Model } from 'objection'

class Chat extends Model {
    static get tableName() {
        return 'chats'
    }
}

export default Chat
