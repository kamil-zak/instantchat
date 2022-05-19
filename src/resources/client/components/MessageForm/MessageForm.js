import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styles from './MessageForm.styles.scss'

const MessageForm = ({ onSend }) => {
    const [content, setContent] = useState('')

    const submit = (e) => {
        e.preventDefault()
        if (content) onSend(content)
        setContent('')
    }

    return (
        <form className={styles.form} onSubmit={submit}>
            <input
                className={styles.form__input}
                placeholder="Wpisz wiadomość..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit" className={styles.form__sendbtn}>
                <FontAwesomeIcon size="2x" icon={faPaperPlane} />
            </button>
        </form>
    )
}

MessageForm.propTypes = {
    onSend: PropTypes.func.isRequired,
}

export default MessageForm
