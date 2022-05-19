import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils'
import { AuthenticationError, gql } from 'apollo-server-core'

export const authDirectiveTypeDefs = gql`
    directive @auth on FIELD_DEFINITION
`

export const authDirectiveTransformer = (schema) =>
    mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            const directive = getDirective(schema, fieldConfig, 'auth')?.[0]
            if (directive) {
                const { resolve } = fieldConfig
                // eslint-disable-next-line no-param-reassign
                fieldConfig.resolve = function (source, args, context, info) {
                    const { authData } = context
                    if (!authData) throw new AuthenticationError()
                    context.authData = { userId: authData.userId || '', conversationId: authData.conversationId || '' }
                    return resolve(source, args, context, info)
                }
                return fieldConfig
            }
        },
    })
