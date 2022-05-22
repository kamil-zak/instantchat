import { ApolloError, AuthenticationError, gql } from 'apollo-server-core'
import jwt from 'jsonwebtoken'
import { secrets } from '../config/env.js'
import User from '../models/user.js'

export const authTypes = gql`
    type Query {
        userPayload: UserPayload
    }

    type Mutation {
        signIn(email: String!, password: String!): Tokens
        refresh(refreshToken: String!): String!
    }

    type UserPayload {
        id: ID!
        email: String!
    }
    type Tokens {
        token: String!
        refreshToken: String!
    }
`
export const authResolvers = {
    Query: {
        userPayload: async (_, args, { authData }) => {
            if (!authData?.userId) return null
            const user = await User.query().select('id', 'email').findById(authData.userId)
            return user
        },
    },
    Mutation: {
        signIn: async (_, { email, password }) => {
            const user = await User.query().where({ email, password }).first()
            if (!user) throw new ApolloError('Dane logowania są niepoprawne', 'INVALID_LOGIN_DATA')
            const userId = String(user.id)
            const token = jwt.sign({ userId }, secrets.tokenSecret, { expiresIn: '3000m' })
            const refreshToken = jwt.sign({ userId }, secrets.refreshTokenSecret)
            return { token, refreshToken }
        },
        refresh: (_, { refreshToken }) =>
            new Promise((resolve, reject) => {
                jwt.verify(refreshToken, secrets.refreshTokenSecret, (err, { userId }) => {
                    if (err) return reject(new AuthenticationError())
                    const token = jwt.sign({ userId }, secrets.tokenSecret, { expiresIn: '30m' })
                    resolve({ token })
                })
            }),
    },
}
