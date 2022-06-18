import { ApolloError, gql } from 'apollo-server-core'
import jwt from 'jsonwebtoken'
import { REFRESH_COOKIE } from '../config/constants'
import { secrets } from '../config/env'
import { getUserById, getUserBySignInData } from '../services/user'
import { IAuthResolvers } from '../types/auth'
import { isTokenUserPayload } from '../types/graphql'

export const authTypes = gql`
    type Query {
        userPayload: UserPayload
    }

    type Mutation {
        signIn(email: String!, password: String!): Tokens
        signOut: Boolean
    }

    type UserPayload {
        userId: ID!
        email: String!
    }
    type Tokens {
        token: String!
    }
`
export const authResolvers: IAuthResolvers = {
    Query: {
        userPayload: async (_, args, { authData }) => {
            if (!isTokenUserPayload(authData)) return null
            const user = await getUserById(authData.userId)
            return user
        },
    },
    Mutation: {
        signIn: async (_, { email, password }, { res }) => {
            const user = await getUserBySignInData({ email, password })
            if (!user) throw new ApolloError('Dane logowania są niepoprawne', 'INVALID_LOGIN_DATA')
            const { userId } = user
            const token = jwt.sign({ userId }, secrets.tokenSecret, { expiresIn: '5m' })
            const refreshToken = jwt.sign({ userId }, secrets.refreshTokenSecret)
            res.cookie(REFRESH_COOKIE, refreshToken, { httpOnly: true, path: '/graphql/refresh' })
            return { token }
        },
        signOut: (_, params, { res }) => {
            res.clearCookie(REFRESH_COOKIE, { path: '/graphql/refresh' })
            return null
        },
    },
}
