import { ApolloProvider } from '@apollo/client'
import React, { useState } from 'react'
import client from './apollo/client'
import ChatBox from './components/ChatBox/ChatBox'
import ChatButton from './components/ChatButton/ChatButton'
import ConversationProvider from './providers/ConversationProvider'

const App = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <ApolloProvider client={client}>
            {isOpen ? (
                <ConversationProvider>
                    <ChatBox onClose={() => setIsOpen(false)} />
                </ConversationProvider>
            ) : (
                <ChatButton onClick={() => setIsOpen(true)} />
            )}
        </ApolloProvider>
    )
}
export default App
