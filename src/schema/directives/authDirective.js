import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils'
import { AuthenticationError, ForbiddenError, gql } from 'apollo-server-core'
import Chat from '../../models/chat.js'
import Conversation from '../../models/conversations.js'

export const authDirectiveTypeDefs = gql`
    directive @auth(authBy: authBy = userId) on FIELD_DEFINITION

    enum authBy {
        userId
        conversationId
    }
`

export const authDirectiveTransformer = (schema) =>
    mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            const directive = getDirective(schema, fieldConfig, 'auth')?.[0]
            if (directive) {
                const { authBy } = directive
                const { resolve } = fieldConfig
                // eslint-disable-next-line no-param-reassign
                fieldConfig.resolve = async function (source, args, context, info) {
                    const { authData } = context
                    if (!authData || !authData[authBy]) throw new AuthenticationError()

                    let newContext = { ...context }
                    switch (authBy) {
                        case 'conversationId':
                            if (args.conversationId !== authData.conversationId) throw new ForbiddenError()
                            break
                        case 'userId':
                            if (args.userId) {
                                if (args.userId !== authData.userId) throw new ForbiddenError()
                            } else if (args.chatId) {
                                const { userId } = await Chat.query().findById(args.chatId).select('userId')
                                if (authData.userId !== String(userId)) throw new ForbiddenError()
                                newContext = { ...context, userId }
                            } else if (args.conversationId) {
                                const { userId, chat } = await Conversation.query()
                                    .findById(args.conversationId)
                                    .select('userId')
                                    .withGraphJoined('chat')
                                if (authData.userId !== String(userId)) throw new ForbiddenError()
                                newContext = { ...context, userId, chat }
                            }
                            break
                        default:
                            throw new Error()
                    }

                    return resolve(source, args, newContext, info)
                }
                return fieldConfig
            }
        },
    })
