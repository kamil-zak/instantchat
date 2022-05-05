import { mergeResolvers } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { chatResolvers, chatTypes } from './chat.js'
import { conversationResolvers, conversationTypes } from './conversation.js'
import { messageResolvers, messageTypes } from './message.js'

const typeDefs = [messageTypes, conversationTypes, chatTypes]

const resolvers = mergeResolvers([messageResolvers, conversationResolvers, chatResolvers])

const schema = makeExecutableSchema({ typeDefs, resolvers })

export default schema
