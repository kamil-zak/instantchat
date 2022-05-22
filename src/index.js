import 'dotenv/config'
import './config/database.js'
import express from 'express'
import fs from 'fs'
import { port } from './config/env.js'
import configureGraphql from './config/graphql.js'
import dev from './middlewares/dev.js'

const app = express()
const server = await configureGraphql(app)

if (process.env.NODE_ENV === 'development') app.use(dev())

app.get('/chatbox/:id', (req, res) => {
    res.setHeader('Content-type', 'text/html')
    const { id } = req.params
    let testPageSource = `TestPage<script src="/chatbox.js?chatId=${id}"></script>`
    if (process.env.NODE_ENV === 'development') testPageSource += '<script src="/client.bundle.js"></script>'
    res.send(testPageSource)
})

app.get('/chatbox.js', (req, res) => {
    const { chatId } = req.query
    if (!chatId) return res.status(404).send('Not found')
    res.setHeader('Content-type', 'application/javascript; charset=utf-8')
    const data = { chatId }
    res.write(`window.instantchat_config = '${JSON.stringify(data)}';`)
    if (process.env.NODE_ENV === 'development') return res.send()
    const stream = fs.createReadStream('public/client.bundle.js')
    stream.on('error', () => res.send())
    stream.on('open', () => stream.pipe(res))
})

app.use((req, res) => res.send('Hello'))

server.listen(port)
