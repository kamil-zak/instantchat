import 'dotenv/config'
import './config/database.js'
import express from 'express'
import { port } from './config/env.js'
import configureGraphql from './config/graphql.js'
import getChatBoxScript from './helpers/getChatBoxScript.js'

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

    res.send(getChatBoxScript(chatId))
})

app.use((req, res) => res.send('Hello'))

server.listen(port)
