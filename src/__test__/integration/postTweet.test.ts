// tslint:disable:no-let
// tslint:disable:no-expression-statement
import { expect } from 'chai'
import * as http from 'http'
import * as request from 'supertest'
import * as sinon from 'sinon'
import * as Twit from 'twit'
import * as knexCleaner from 'knex-cleaner'
import db from '../../db'
import * as users from '../../users'
import { createServer } from '../../server'
import { Socket } from 'net'


describe('post a tweet', () => {
  let app: http.Server
  let agent: request.SuperTest<request.Test>

  before(() => knexCleaner.clean(db as any))
  before(() => app = createServer(router => (
    router.post('/auth/fake', async ctx => {
      const profile: users.Profile = {
        id: '12345',
        username: 'my_fake_user',
        displayName: 'my_cool_display_name',
        photos: [{ value: 'https://my-sweet-images.com/profile.png' }],
        emails: [{ value: 'fake@email.com' }],
      }
      const insertedUser = await users.upsertWithTwitterProfile(profile)
      const fakeUser: SerializedUser = { id: insertedUser.id, token: 'thisisatoken', tokenSecret: 'thisisatokensecret' }
      ctx.session!.passport = { user: fakeUser }
      Object.assign(ctx.response, { status: 200, body: 'OK' })
    })
  )).listen())
  before(() => agent = request.agent(app))
  beforeEach(() => {
    const resp = new http.IncomingMessage(new Socket())
    resp.statusCode = 200
    post = sinon.stub(Twit.prototype, 'post').returns(
      new Promise(
        (resolve) => resolve({ resp, data: { id_str: '1111111', user: { screen_name: '@morehumaninter1' } } })
      )
    )
  })
  after(() => {
    app.close()
  })
  afterEach(() => sinon.restore())
  it('should return a valid response for a tweet without images', async () => {
    expect(await agent.post('/v1/auth/fake')).to.have.property('status', 200)
    const response = await agent
      .post('/v1/feedback')
      .send({ host: 'morehumaninternet.org', status: 'Make the internet great again' })
      .expect(201, { url: 'https://twitter.com/@morehumaninter1/statuses/1111111' })

    expect(response.body).to.eql({ url: 'https://twitter.com/@morehumaninter1/statuses/1111111' })
  })
})
