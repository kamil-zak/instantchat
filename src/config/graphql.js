import { useServer } from 'graphql-ws/lib/use/ws'
import { WebSocketServer } from 'ws'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import { PubSub } from 'graphql-subscriptions'
import jwt from 'jsonwebtoken'
import DataLoader from 'dataloader'
import schema from '../schema/schema.js'
import { secrets } from './env.js'
import { batchUnreadCount } from './dataloader.js'
import { REFRESH_COOKIE } from './constants.js'

const pubsub = new PubSub()

const getJWTpayload = (token) => {
    if (!token) return Promise.resolve(null)
    return new Promise((resolve) => {
        jwt.verify(token, secrets.tokenSecret, (err, payload) => {
            if (err) resolve(null)
            resolve(payload)
        })
    })
}

const context = async ({ req, res }) => {
    const token = req.headers.authorization?.split(' ')?.[1]
    const authData = await getJWTpayload(token)
    const unreadCountLoader = new DataLoader(batchUnreadCount)
    return { pubsub, authData, unreadCountLoader, res }
}

const wsContext = async (ctx) => {
    const token = ctx.connectionParams.authorization?.split(' ')?.[1]
    const authData = await getJWTpayload(token)
    return { pubsub, authData }
}

const configureGraphql = async (app) => {
    app.get('/graphql/refresh', async (req, res) => {
        const refreshToken = req.cookies[REFRESH_COOKIE]
        jwt.verify(refreshToken, secrets.refreshTokenSecret, (err, payload) => {
            if (err) return res.sendStatus(401)
            const { userId } = payload
            const token = jwt.sign({ userId }, secrets.tokenSecret, { expiresIn: '5m' })
            res.send({ token })
        })
    })

    const server = createServer(app)
    const wsServer = new WebSocketServer({ server })
    useServer({ schema, context: wsContext }, wsServer)
    const apolloServer = new ApolloServer({ schema, context })
    await apolloServer.start()
    apolloServer.applyMiddleware({ app })
    return server
}

export default configureGraphql
