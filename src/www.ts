import app from './app'
import {ENV} from './config'

const server = app.listen(ENV.port, () => {
  console.log('Application is listening at', server.address())
})
