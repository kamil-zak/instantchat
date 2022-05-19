import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import dayjs from 'dayjs'
import styles from './MessageItem.styles.scss'

const formatTime = (sendingTime) => {
    const time = dayjs(sendingTime)
    return time.isToday() ? time.format('H:mm') : time.fromNow()
}

const MessageItem = ({ content, time, isResponse }) => {
    const wrapperClasses = classNames(styles.wrapper, { [styles['wrapper--response']]: isResponse })
    const messageClasses = classNames(styles.message, { [styles['message--response']]: isResponse })
    const timeClasses = classNames(styles.time, { [styles['time--response']]: isResponse })

    return (
        <div className={wrapperClasses}>
            <div className={messageClasses}>{content}</div>
            <div className={timeClasses}>{formatTime(time)}</div>
        </div>
    )
}

MessageItem.propTypes = {
    content: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    isResponse: PropTypes.bool.isRequired,
}

export default MessageItem
