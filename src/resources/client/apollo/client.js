import { ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { setContext } from '@apollo/client/link/context'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { getConversationToken } from '../services/conversationService'
import { typePolicies } from './typePolicies'

const httpLink = createHttpLink({ uri: process.env.GRAPHQL_URL })

const authLink = setContext((_, { headers }) => ({
    headers: { ...headers, authorization: `Bearer ${getConversationToken()}` },
})).concat(httpLink)

// eslint-disable-next-line no-undef

const wsLink = new GraphQLWsLink(
    createClient({
        url: process.env.WS_URL,
        connectionParams: () => ({ authorization: `Bearer ${getConversationToken()}` }),
    })
)

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query)
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    authLink
)

const client = new ApolloClient({ link: splitLink, cache: new InMemoryCache({ typePolicies }) })

export default client
