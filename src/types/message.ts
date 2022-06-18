import { IResolvers } from '@graphql-tools/utils'
import { IChat } from './chat'
import { Resolver, SubscriptionResolver } from './graphql'

export interface IMessage {
    id: number
    isResponse: boolean
    content: string
    time: Date
}

interface ILimitedMessages {
    hasMore: boolean
    messages: IMessage[]
}

export interface INewMessageData {
    userId: number
    conversationId: number
    chat: IChat
    message: IMessage
}

export interface INewMessageArgs {
    userId: string
}

export interface INewMessageWidgetArgs {
    conversationId: string
}

type GetMessagesQuery = Resolver<{ conversationId: string; limit: number; before: string }, ILimitedMessages>
type SendMessageMutation = Resolver<{ conversationId: string; content: string }, IMessage>
type MarkAsReadMutation = Resolver<{ conversationId: string }, null>
type NewMessageSubscription = SubscriptionResolver<INewMessageData>
type TimeResolver = Resolver<void, string, IMessage>

export interface IMessageResolvers extends IResolvers {
    Query: { getMessages: GetMessagesQuery }
    Mutation: { sendMessage: SendMessageMutation; markAsRead: MarkAsReadMutation }
    Subscription: { newMessage: NewMessageSubscription }
    Message: { time: TimeResolver }
}

type GetMessagesWidgetQuery = Resolver<{ conversationId: string; limit: number; before: string }, ILimitedMessages>
type SendMessageWidgetMutation = Resolver<{ conversationId: string; content: string }, IMessage>
type MarkAsReadWidgetMutation = Resolver<{ conversationId: string }, null>
type NewMessageWidgetSubscription = SubscriptionResolver<INewMessageData>

export interface IMessageWidgetResolvers extends IResolvers {
    Query: { getMessagesWidget: GetMessagesWidgetQuery }
    Mutation: { sendMessageWidget: SendMessageWidgetMutation; markAsReadWidget: MarkAsReadWidgetMutation }
    Subscription: { newMessageWidget: NewMessageWidgetSubscription }
}
