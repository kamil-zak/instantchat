import { useServer } from 'graphql-ws/lib/use/ws'
import { WebSocketServer } from 'ws'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import { PubSub } from 'graphql-subscriptions'
import jsonwebtoken from 'jsonwebtoken'
import DataLoader from 'dataloader'
import schema from '../schema/schema.js'
import { secrets } from './env.js'
import { batchUnreadCount } from './dataloader.js'

const pubsub = new PubSub()

const verifyJWT = (token) => {
    if (!token) return Promise.resolve(null)
    return new Promise((resolve) => {
        jsonwebtoken.verify(token, secrets.tokenSecret, (err, payload) => {
            if (err) resolve(null)
            resolve(payload)
        })
    })
}

const context = async ({ req }) => {
    const token = req.headers.authorization?.split(' ')?.[1]
    const authData = await verifyJWT(token)
    const unreadCountLoader = new DataLoader(batchUnreadCount)
    return { pubsub, authData, unreadCountLoader }
}

const wsContext = async (ctx) => {
    const token = ctx.connectionParams.authorization?.split(' ')?.[1]
    const authData = await verifyJWT(token)
    return { pubsub, authData }
}

const configureGraphql = async (app) => {
    const server = createServer(app)
    const wsServer = new WebSocketServer({ server })
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useServer({ schema, context: wsContext }, wsServer)
    const apolloServer = new ApolloServer({ schema, context })
    await apolloServer.start()
    apolloServer.applyMiddleware({ app })
    return server
}

export default configureGraphql
