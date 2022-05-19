const emptyMessages = {
    hasMore: true,
    messages: [],
}

const mergeMessages = (prev = emptyMessages, incoming = emptyMessages) => {
    const notExist = ({ __ref }) => prev.messages.every((message) => message.__ref !== __ref)
    const newMessages = incoming.messages.filter(notExist)
    return {
        hasMore: incoming.hasMore ?? prev.hasMore,
        messages: incoming.hasMore !== undefined ? [...newMessages, ...prev.messages] : [...prev.messages, ...newMessages],
    }
}

export const typePolicies = {
    Query: {
        fields: {
            getMessages: {
                keyArgs: ['conversationId'],
                merge: mergeMessages,
            },
        },
    },
}
