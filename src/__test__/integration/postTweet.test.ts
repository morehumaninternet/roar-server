// tslint:disable:no-expression-statement
import { expect } from 'chai'
import * as http from 'http'
import * as sinon from 'sinon'
import * as Twit from 'twit'
import * as users from '../../models/users'
import { createMocks } from '../mocks'
import { Socket } from 'net'


describe('post a tweet', () => {
  const mocks = createMocks(router => (
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
  ))

  beforeEach(() => {
    const resp = new http.IncomingMessage(new Socket())
    resp.statusCode = 200
    sinon.stub(Twit.prototype, 'post').resolves({
      resp,
      data: { id_str: '1111111', user: { screen_name: '@morehumaninter1' } }
    })
  })

  it('returns a valid response for a tweet without images', async () => {
    expect(await mocks.agent.post('/v1/auth/fake')).to.have.property('status', 200)
    const response = await mocks.agent
      .post('/v1/feedback')
      .send({ host: 'morehumaninternet.org', status: 'Make the internet great again' })
      .expect(201, { url: 'https://twitter.com/@morehumaninter1/statuses/1111111' })

    expect(response.body).to.eql({ url: 'https://twitter.com/@morehumaninter1/statuses/1111111' })
  })
})
