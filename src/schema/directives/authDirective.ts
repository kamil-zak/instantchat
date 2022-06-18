import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils'
import { AuthenticationError, ForbiddenError, gql } from 'apollo-server-core'
import { getChatUser } from '../../services/chat'
import { getConversationUser } from '../../services/conversation'

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
                    if (!authData || !authData[authBy]) throw new AuthenticationError('')

                    switch (authBy) {
                        case 'conversationId':
                            if (Number(args.conversationId) !== authData.conversationId) throw new ForbiddenError('')
                            break
                        case 'userId':
                            if (args.userId) {
                                if (Number(args.userId) !== authData.userId) throw new ForbiddenError('')
                            } else if (args.chatId) {
                                const userId = await getChatUser(args.chatId)
                                if (authData.userId !== userId) throw new ForbiddenError('')
                            } else if (args.conversationId) {
                                const userId = await getConversationUser(args.conversationId)
                                if (authData.userId !== userId) throw new ForbiddenError('')
                            }
                            break
                        default:
                            throw new Error()
                    }

                    return resolve(source, args, context, info)
                }
                return fieldConfig
            }
        },
    })
