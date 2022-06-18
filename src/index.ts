import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import { create } from 'express-handlebars'
import { join } from 'path'
import { port } from './config/env'
import './config/database'
import configureGraphql from './config/graphql'
import getChatBoxScript from './helpers/getChatBoxScript'
import Chat from './models/chat'

const init = async () => {
    const app = express()
    app.use(cookieParser())

    app.engine('hbs', create({ extname: '.hbs' }).engine)
    app.set('view engine', 'hbs')
    app.set('views', join('src', 'views'))

    app.use(express.static(join('src', 'public')))

    const server = await configureGraphql(app)

    app.get('/chatbox/:id', async (req, res, next) => {
        const { id } = req.params
        if (!id) return next()
        const chat = await Chat.query().findById(id)
        if (!chat) return next()
        res.render('testChatBox', { chatId: id, chatName: chat.name, layout: 'testPage' })
    })

    app.get('/chatbox.js', (req, res) => {
        const { chatId } = req.query
        if (!chatId) return res.status(404).send('Not found')
        res.setHeader('Content-type', 'application/javascript; charset=utf-8')

        res.send(getChatBoxScript(chatId))
    })

    app.use((req, res) => res.send('Hello TypeScript'))

    server.listen(port)
}

init()
