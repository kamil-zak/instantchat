import React from 'react'
import ReactDOM from 'react-dom/client'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import relativeTime from 'dayjs/plugin/relativeTime'
import App from './App'
import 'dayjs/locale/pl'
import styles from './global.scss'
import chatBoxConfig from './services/configService'

dayjs.extend(isToday)
dayjs.extend(relativeTime)
dayjs.locale('pl')

const init = () => {
    if (!chatBoxConfig) return
    const container = document.createElement('div')
    container.className = styles.chatbox
    document.body.appendChild(container)

    const root = ReactDOM.createRoot(container)

    const render = () => {
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        )
    }

    render()

    if (import.meta.webpackHot) {
        import.meta.webpackHot.accept('./App.js', () => render())
    }
}
window.addEventListener('load', init)
