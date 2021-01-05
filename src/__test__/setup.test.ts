// tslint:disable:no-expression-statement
import db from '../db'
import sessionStore from '../auth/sessionStore'

after(() => db.destroy())
after(() => sessionStore.client.disconnect())
