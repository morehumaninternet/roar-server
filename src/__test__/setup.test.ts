// tslint:disable:no-expression-statement
import db from '../db'
import sessionStore from '../sessionStore'

after(() => db.destroy())
after(() => sessionStore.client.disconnect())
