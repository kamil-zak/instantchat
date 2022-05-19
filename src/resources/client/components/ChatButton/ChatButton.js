import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import styles from './ChatButton.styles.scss'

const ChatButton = ({ onClick }) => {
    return (
        <button className={styles.wrapper} onClick={onClick}>
            <FontAwesomeIcon icon={faMessage} size="2x" />
            Chat
        </button>
    )
}

ChatButton.propTypes = {
    onClick: PropTypes.func,
}

export default ChatButton
