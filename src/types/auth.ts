import { IResolvers } from '@graphql-tools/utils'
import { Resolver } from './graphql'

export interface IUserPayload {
    userId: number
    email: string
}

type UserPayloadQuery = Resolver<void, IUserPayload>
type SignInMutation = Resolver<{ email: string; password: string }, { token: string }>
type SignOutMutation = Resolver<void, void>

export interface IAuthResolvers extends IResolvers {
    Query: { userPayload: UserPayloadQuery }
    Mutation: { signIn: SignInMutation; signOut: SignOutMutation }
}
