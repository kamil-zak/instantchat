import React, { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import { useConversation } from '../../providers/ConversationProvider'
import styles from './ChatBox.styles.scss'
import MessageForm from '../MessageForm/MessageForm'
import MessageItem from '../MessageItem/MessageItem'

const ChatBox = ({ onClose }) => {
    const { messages, getMore, sendMessage } = useConversation()
    const messagesRef = useRef(null)

    const lastId = messages?.[messages.length - 1]?.id

    useEffect(() => {
        const { scrollHeight } = messagesRef.current
        messagesRef.current.scroll(0, scrollHeight)
    }, [lastId])

    useEffect(() => {
        if (!messagesRef.current) return
        let firstElement
        const listener = (e) => {
            if (e.target.scrollTop === 0) {
                firstElement = messagesRef.current.firstElementChild
                getMore()
            }
        }
        const messagesDiv = messagesRef.current
        messagesDiv.addEventListener('scroll', listener)

        return () => {
            if (messagesDiv && firstElement) messagesDiv.scrollTop = firstElement.offsetTop
            messagesDiv.removeEventListener('scroll', listener)
        }
    }, [getMore])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                Skontaktuj się z nami!
                <FontAwesomeIcon onClick={onClose} className={styles.header__close} icon={faXmark} />
            </div>
            <div ref={messagesRef} className={styles.messages}>
                {messages.map((message) => (
                    <MessageItem key={message.id} {...message} />
                ))}
            </div>
            <MessageForm onSend={sendMessage} />
        </div>
    )
}

ChatBox.propTypes = {
    onClose: PropTypes.func.isRequired,
}

export default ChatBox
