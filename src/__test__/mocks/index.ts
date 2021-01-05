/*
  Create a mock server, cleaning the database and having the server listen before the tests in each describe block.
  Return an agent that can make requests to the mock server and a getWindow function that resolves with a DOMWindow
  of the requested page.
*/
// tslint:disable:no-let
// tslint:disable:no-expression-statement
import * as http from 'http'
import * as Router from 'koa-router'
import * as request from 'supertest'
import * as sinon from 'sinon'
import * as knexCleaner from 'knex-cleaner'
import db from '../../db'
import { createServer } from '../../server'
import { getWindow } from './getWindow'
import { DOMWindow } from 'jsdom'

type Mocks = {
  agent: request.SuperTest<request.Test>
  getWindow(path: string): Promise<DOMWindow>
}

let mocked = false

export function createMocks(withRouter?: (router: Router) => Router): Mocks {
  const app = createServer(withRouter)
  let server: http.Server
  let agent: request.SuperTest<request.Test>

  before(() => {
    if (mocked) throw new Error("A mock server is already active. Check that you're calling createMocks at the top-level of a describe block")
    mocked = true
  })
  before(() => knexCleaner.clean(db as any, { ignoreTables: ['knex_migrations', 'knex_migrations_lock'] }))
  before(() => server = app.listen())
  before(() => agent = request.agent(server))
  after(() => server.close())
  after(() => sinon.restore())
  after(() => mocked = false)

  return {
    get agent(): request.SuperTest<request.Test> {
      return agent
    },
    getWindow: (path: string) => getWindow(agent, path)
  }
}
