import { Model } from 'objection'
import { IChat } from '../types/chat'

interface Chat extends IChat {
    userId: number
}

class Chat extends Model {
    static tableName = 'chats'
}

export default Chat
