import { ApolloError, gql } from 'apollo-server-core'
import jwt from 'jsonwebtoken'
import { REFRESH_COOKIE } from '../config/constants.js'
import { secrets } from '../config/env.js'
import User from '../models/user.js'

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
export const authResolvers = {
    Query: {
        userPayload: async (_, args, { authData }) => {
            if (!authData?.userId) return null
            const user = await User.query().select({ userId: 'id', email: 'email' }).findById(authData.userId)
            return user
        },
    },
    Mutation: {
        signIn: async (_, { email, password }, { res }) => {
            const user = await User.query().where({ email, password }).first()
            if (!user) throw new ApolloError('Dane logowania są niepoprawne', 'INVALID_LOGIN_DATA')
            const userId = String(user.id)
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
