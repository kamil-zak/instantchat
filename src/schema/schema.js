import { mergeResolvers } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { authResolvers, authTypes } from './auth.js'
import { chatResolvers, chatTypes } from './chat.js'
import { conversationResolvers, conversationTypes } from './conversation.js'
import { messageResolvers, messageTypes } from './message.js'
import { authDirectiveTypeDefs, authDirectiveTransformer } from './directives/authDirective.js'
import { messageWidgetResolvers, messageWidgetTypes } from './widget/message.js'
import { conversationWidgetResolvers, conversationWidgetTypes } from './widget/conversation.js'

const typeDefs = [authDirectiveTypeDefs, authTypes, messageTypes, messageWidgetTypes, conversationTypes, conversationWidgetTypes, chatTypes]

const resolvers = mergeResolvers([
    authResolvers,
    messageResolvers,
    messageWidgetResolvers,
    conversationResolvers,
    conversationWidgetResolvers,
    chatResolvers,
])

const schema = makeExecutableSchema({ typeDefs, resolvers })

export default authDirectiveTransformer(schema)
