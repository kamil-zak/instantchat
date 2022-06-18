import { mergeResolvers } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { authResolvers, authTypes } from './auth'
import { chatResolvers, chatTypes } from './chat'
import { conversationResolvers, conversationTypes } from './conversation'
import { messageResolvers, messageTypes } from './message'
import { authDirectiveTypeDefs, authDirectiveTransformer } from './directives/authDirective'
import { messageWidgetResolvers, messageWidgetTypes } from './widget/message'
import { conversationWidgetResolvers, conversationWidgetTypes } from './widget/conversation'

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
