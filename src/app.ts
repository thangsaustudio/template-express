import express from 'express'
import cookieParser from 'cookie-parser'
import AppRouter from './router'

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', true)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(AppRouter)

export default app
