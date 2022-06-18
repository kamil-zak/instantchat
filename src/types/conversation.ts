import { IResolvers } from '@graphql-tools/utils'
import Chat from '../models/chat'
import { Resolver, SubscriptionResolver } from './graphql'
import { IMessage } from './message'

export interface IConversationData {
    id: number
    chat: Chat
    unreadCount: number
    latestMessage: IMessage
}

export interface IIsTypingWidgetData {
    isTypingWidget: boolean
    conversationId: number
}
export interface IIsTypingWidgetArgs {
    conversationId: string
}

export interface IIsTypingData {
    isTyping: boolean
    conversationId: number
}
export interface IIsTypingArgs {
    conversationId: string
}

type GetConversationsQuery = Resolver<{ userId: string }, IConversationData[]>
type IsTypingMutation = Resolver<{ conversationId: string }, void>
type IsTypingWidgetSubscription = SubscriptionResolver<IIsTypingWidgetData, boolean>
type UnreadCountResolver = Resolver<void, number, IConversationData>

export interface IConversationResolvers extends IResolvers {
    Query: { getConversations: GetConversationsQuery }
    Mutation: { isTyping: IsTypingMutation }
    Subscription: { isTypingWidget: IsTypingWidgetSubscription }
    Conversation: { unreadCount: UnreadCountResolver }
}

type CreateConversationMutation = Resolver<{ chatId: string }, { token: string; id: number }>
type IsTypingWidgetMutation = Resolver<{ conversationId: string }, void>
type IsTypingSubscription = SubscriptionResolver<IIsTypingData, boolean>

export interface IConversationWidgetResolvers extends IResolvers {
    Mutation: {
        createConversation: CreateConversationMutation
        isTypingWidget: IsTypingWidgetMutation
    }
    Subscription: { isTyping: IsTypingSubscription }
}
