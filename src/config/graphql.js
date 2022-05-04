import { useServer } from 'graphql-ws/lib/use/ws'
import { WebSocketServer } from 'ws'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import { PubSub } from 'graphql-subscriptions'
import schema from '../schema/schema.js'

const pubsub = new PubSub()

const context = () => {
    return { pubsub }
}

const wsContext = () => {
    return { pubsub }
}

const configureGraphql = async (app) => {
    const server = createServer(app)
    const wsServer = new WebSocketServer({ server })
    useServer({ schema, context: wsContext }, wsServer)
    const apolloServer = new ApolloServer({ schema, context })
    await apolloServer.start()
    apolloServer.applyMiddleware({ app })
    return server
}

export default configureGraphql
