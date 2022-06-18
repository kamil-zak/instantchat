import DataLoader from 'dataloader'
import { Response } from 'express'
import { PubSub, ResolverFn } from 'graphql-subscriptions'

export interface IUserTokenPayload {
    userId: number
}

export interface IConversationTokenPayload {
    conversationId: number
}

export type TokenPayload = IUserTokenPayload | IConversationTokenPayload | null

export interface IContext<T extends TokenPayload = TokenPayload> {
    pubsub: PubSub
    authData: T
    unreadCountLoader: DataLoader<number, number>
    res: Response
}

export interface IWSContext {
    pubsub: PubSub
}

export type SubscriptionResolver<T, U = T> = { subscribe: ResolverFn; resolve: (data: T) => U }

export type Resolver<TArgs, TReturn, TParent = void> = (parent: TParent, args: TArgs, context: IContext) => Promise<TReturn>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTokenUserPayload = (authData: any): authData is IUserTokenPayload => typeof authData?.userId === 'number'
