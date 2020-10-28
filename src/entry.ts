const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
import '../env'
import server from './server'

const port = Number(process.env.PORT) || 5004

const httpsData = {
    key: fs.readFileSync(path.resolve(process.cwd(), 'certs/localhost.key'), 'utf8').toString(),
    cert: fs.readFileSync(path.resolve(process.cwd(), 'certs/localhost.crt'), 'utf8').toString(),
}

// tslint:disable: no-expression-statement
const listenCb = (error: any) => {
    if (error) {
        console.log(`Failed to start roar-server on port ${port}: `, error, (error && error.stack))
    } else {
        console.log(`roar-server listening on ${port}`)
    }
}

try {
    // If we're running on production, we expect to have Nginx or Apache that will handle HTTPS for us
    if (process.env.NODE_ENV === 'prod') {
        http.createServer(server.callback()).listen(port, listenCb)
    } else {
        https.createServer(httpsData, server.callback()).listen(port, listenCb)
    }
} catch (exception) {
    console.log('Failed to start server: ', exception, (exception && exception.stack))
}
// tslint:enable: no-expression-statement
