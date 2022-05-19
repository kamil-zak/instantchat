import { mergeResolvers } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { authResolvers, authTypes } from './auth.js'
import { chatResolvers, chatTypes } from './chat.js'
import { conversationResolvers, conversationTypes } from './conversation.js'
import { messageResolvers, messageTypes } from './message.js'
import { authDirectiveTypeDefs, authDirectiveTransformer } from './directives/authDirective.js'

const typeDefs = [authDirectiveTypeDefs, authTypes, messageTypes, conversationTypes, chatTypes]

const resolvers = mergeResolvers([authResolvers, messageResolvers, conversationResolvers, chatResolvers])

const schema = makeExecutableSchema({ typeDefs, resolvers })

export default authDirectiveTransformer(schema)
