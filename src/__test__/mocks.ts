// tslint:disable:no-let
// tslint:disable:no-expression-statement
import * as http from 'http'
import * as Router from 'koa-router'
import * as request from 'supertest'
import * as sinon from 'sinon'
import * as knexCleaner from 'knex-cleaner'
import db from '../db'
import { createServer } from '../server'

export function createMocks(withRouter?: (router: Router) => Router) {
  const app = createServer(withRouter)
  let server: http.Server
  let agent: request.SuperTest<request.Test>

  before(() => knexCleaner.clean(db as any))
  before(() => server = app.listen())
  before(() => agent = request.agent(server))
  after(() => server.close())
  afterEach(() => sinon.restore())

  return {
    get agent() {
      return agent
    }
  }
}
