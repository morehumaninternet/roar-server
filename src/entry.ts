import '../env'
import * as fs from 'fs'
import * as path from 'path'
import * as http from 'http'
import * as https from 'https'
import { createServer } from './server'

const port = Number(process.env.PORT) || 5004

const server = createServer()

// @ts-ignore
const isProd = process.env.NODE_ENV === 'prod'

// On prod, create a normal http server as heroku sets up its own HTTPS proxy server
// Locally, run our own HTTPS server as the twitter authentication only works over HTTPS
const httpServer = isProd
  ? http.createServer(server.callback())
  : https.createServer(
      {
        key: fs.readFileSync(path.join(__dirname, '..', 'certs/localhost.key'), 'utf8').toString(),
        cert: fs.readFileSync(path.join(__dirname, '..', 'certs/localhost.crt'), 'utf8').toString(),
      },
      server.callback()
    )

// tslint:disable:no-expression-statement
httpServer.listen(port, (error: any) => {
  if (error) throw error
  console.log(`roar-server listening on ${port} ${new Date()}`)
})
