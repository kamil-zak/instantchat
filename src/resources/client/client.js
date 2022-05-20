import React from 'react'
import ReactDOM from 'react-dom/client'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import relativeTime from 'dayjs/plugin/relativeTime'
import App from './App'
import 'dayjs/locale/pl'
import './global.scss'
import chatBoxConfig from './services/configService'

dayjs.extend(isToday)
dayjs.extend(relativeTime)
dayjs.locale('pl')

const init = () => {
    if (!chatBoxConfig) return
    const container = document.createElement('div')
    container.style.fontFamily = '"Montserrat", sans-serif'
    container.style.position = 'fixed'
    container.style.right = '15px'
    container.style.bottom = '15px'
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
