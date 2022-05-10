import express from 'express'
import {autoload, Controllers, load} from './core/ExpressController'
import {createCapture} from './core/ErrorCapture'

autoload()

const AppRouter = express.Router()

AppRouter.get('/hello', load('hello.echo'))

AppRouter.use(createCapture())

export default AppRouter
