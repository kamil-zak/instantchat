import 'dotenv/config'
import express from 'express'
import configureGraphql from './config/graphql.js'

const app = express()
const server = await configureGraphql(app)

app.use((req, res) => res.send('Hello'))

server.listen(3434)
