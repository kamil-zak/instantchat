import { IResolvers } from '@graphql-tools/utils'
import { Resolver } from './graphql'

export interface IChatDetails {
    name: string
    title: string
    subtitle: string
    color: string
}

export interface IChat extends IChatDetails {
    id: number
}

type GetChatsQuery = Resolver<{ userId: string }, IChat[]>
type GetChatQuery = Resolver<{ chatId: string }, IChat>
type CreateChatMutation = Resolver<{ userId: string; details: IChatDetails }, IChat>
type UpdateChatMutation = Resolver<{ chatId: string; details: IChatDetails }, IChat>
type DeleteChatMutation = Resolver<{ chatId: string }, { id: number }>

export interface IChatResolvers extends IResolvers {
    Query: { getChats: GetChatsQuery; getChat: GetChatQuery }
    Mutation: { createChat: CreateChatMutation; updateChat: UpdateChatMutation; deleteChat: DeleteChatMutation }
}
