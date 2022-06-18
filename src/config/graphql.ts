import { useServer } from 'graphql-ws/lib/use/ws'
import { WebSocketServer } from 'ws'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import { PubSub } from 'graphql-subscriptions'
import jwt from 'jsonwebtoken'
import DataLoader from 'dataloader'
import { Request, Response } from 'express'
import schema from '../schema/schema'
import { secrets } from './env'
import { batchUnreadCount } from './dataloader'
import { REFRESH_COOKIE, REFRESH_PATH, TOKEN_EXPIRES } from './constants'
import { IContext, TokenPayload } from '../types/graphql'

const pubsub = new PubSub()

const getJWTpayload = (token): Promise<TokenPayload> => {
    if (!token) return Promise.resolve(null)
    return new Promise((resolve) => {
        jwt.verify(token, secrets.tokenSecret, (err, payload: TokenPayload) => {
            if (err) resolve(null)
            resolve(payload)
        })
    })
}

const context = async ({ req, res }) => {
    const token = req.headers.authorization?.split(' ')?.[1]
    const authData = await getJWTpayload(token)
    const unreadCountLoader = new DataLoader(batchUnreadCount)
    const contextData: IContext = { pubsub, authData, unreadCountLoader, res }
    return contextData
}

const wsContext = async (ctx) => {
    const token = ctx.connectionParams.authorization?.split(' ')?.[1]
    const authData = jwt.decode(token)
    return { pubsub, authData }
}

const wsConnect = async (ctx) => {
    const token = ctx.connectionParams?.authorization?.split(' ')?.[1]
    if (!(await getJWTpayload(token))) return false
}

const configureGraphql = async (app) => {
    app.get(REFRESH_PATH, async (req: Request, res: Response) => {
        const refreshToken = req.cookies[REFRESH_COOKIE]
        jwt.verify(refreshToken, secrets.refreshTokenSecret, (err, payload) => {
            if (err) return res.sendStatus(401)
            const { userId } = payload
            const token = jwt.sign({ userId }, secrets.tokenSecret, { expiresIn: TOKEN_EXPIRES })
            res.send({ token })
        })
    })

    const server = createServer(app)
    const wsServer = new WebSocketServer({ server })
    useServer({ schema, context: wsContext, onConnect: wsConnect }, wsServer)
    const apolloServer = new ApolloServer({ schema, context })
    await apolloServer.start()
    apolloServer.applyMiddleware({ app })
    return server
}

export default configureGraphql
