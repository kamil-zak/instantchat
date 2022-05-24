import 'dotenv/config'
import './config/database.js'
import express from 'express'
import { chatBoxClientUrl, port } from './config/env.js'
import configureGraphql from './config/graphql.js'

const app = express()
const server = await configureGraphql(app)

app.get('/chatbox/:id', (req, res) => {
    res.setHeader('Content-type', 'text/html')
    const { id } = req.params
    const testPageSource = `TestPage<script src="/chatbox.js?chatId=${id}"></script>`
    res.send(testPageSource)
})

app.get('/chatbox.js', (req, res) => {
    const { chatId } = req.query
    if (!chatId) return res.status(404).send('Not found')
    res.setHeader('Content-type', 'application/javascript; charset=utf-8')
    const script = `
    const init = function() {
        const iframe = document.createElement('iframe')
        iframe.style = 'border: 0;position: fixed; right: 15px; bottom: 15px; width: 0px; height: 0px;'
        iframe.src = '${chatBoxClientUrl}${chatId}'
        document.body.appendChild(iframe)
        window.addEventListener(
            'message',
            function ({ data }) {
                if (!data.instantchatDimensions) return
                const { width, height } = data.instantchatDimensions
                iframe.style.height = height + 'px';
                iframe.style.width = width + 'px';
            },
            false
        );
    }
    window.addEventListener("load", init);
    `
    res.send(script)
})

app.use((req, res) => res.send('Hello'))

server.listen(port)
