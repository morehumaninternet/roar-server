// tslint:disable:no-let
// tslint:disable:no-expression-statement
import { expect } from 'chai'
import * as request from 'supertest'
import * as sinon from 'sinon'
import axios from 'axios'
import db from '../db'
import server from '../server'


describe('end-to-end', () => {

  let app: any
  let agent: request.SuperTest<request.Test>

  before(() => app = server.listen(5005))
  before(() => {
    agent = request.agent(app)
  })

  after(() => app && app.close())
  after(() => db.destroy()) // Leave the database contents alone in case these are useful to inspect after tests have run
  afterEach(() => sinon.restore())

  describe('/website', () => {
    it('400s when GET does not include domain', done => {
      agent
        .get('/v1/website')
        .expect(400)
        .end(done)
    })

    it('200s responding with the twitter_handle pulled from the appropriate meta tag when not previously found', async () => {
      const response = await agent
        .get('/v1/website?domain=airbnb.com')
        .expect(200)

      expect(response.body).to.eql({
        domain: 'airbnb.com',
        twitter_handle: '@airbnb'
      })
    })

    it('200s responding with the twitter_handle pulled from the database when previously found', async () => {
      sinon.stub(axios, 'get').throws('Should not be called')

      const response = await agent
        .get('/v1/website?domain=airbnb.com')
        .expect(200)

      expect(response.body).to.eql({
        domain: 'airbnb.com',
        twitter_handle: '@airbnb'
      })
    })

    it('404s when the website does not exist', done => {
      agent
        .get('/v1/website?domain=alwejalkwjeklaweklawe.com')
        .expect(404)
        .end(done)
    })

    it('200s with a null twitter_handle when the website exists, but has no twitter', async () => {
      const response = await agent
        .get('/v1/website?domain=https://generationsinc.org')
        .expect(200)

      expect(response.body).to.eql({
        domain: 'generationsinc.org',
        twitter_handle: null
      })
    })
  })
})
