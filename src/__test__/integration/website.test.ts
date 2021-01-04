// tslint:disable:no-let
// tslint:disable:no-expression-statement
import { expect } from 'chai'
import * as sinon from 'sinon'
import axios from 'axios'
import * as clearbit from '../../clearbit'
import { createMocks } from '../mocks'


describe('/website', () => {
  const mocks = createMocks()
  let clearBitGetTwitterHandle: sinon.SinonStub

  beforeEach(() => clearBitGetTwitterHandle = sinon.stub(clearbit, 'getTwitterHandle').throws())
  afterEach(() => sinon.restore())

  it('400s when GET does not include domain', done => {
    mocks.agent
      .get('/v1/website')
      .expect(400)
      .end(done)
  })

  it('200s responding with the twitter_handle pulled from the appropriate meta tag when not previously found', async () => {
    const response = await mocks.agent
      .get('/v1/website?domain=airbnb.com')
      .expect(200)

    expect(response.body).to.eql({
      domain: 'airbnb.com',
      twitter_handle: '@airbnb'
    })
  })

  it('200s responding with the twitter_handle pulled from the database when previously found', async () => {
    sinon.stub(axios, 'get').throws('Should not be called')

    const response = await mocks.agent
      .get('/v1/website?domain=airbnb.com')
      .expect(200)

    expect(response.body).to.eql({
      domain: 'airbnb.com',
      twitter_handle: '@airbnb'
    })
  })

  it('404s when the website does not exist', done => {
    mocks.agent
      .get('/v1/website?domain=alwejalkwjeklaweklawe.com')
      .expect(404)
      .end(done)
  })

  it('200s with the twitter handle from clearbit if the website HTML does not have a meta tag with the twitter handle', async () => {
    clearBitGetTwitterHandle.resolves('@generations')

    const response = await mocks.agent
      .get('/v1/website?domain=https://generationsinc.org')
      .expect(200)

    expect(response.body).to.eql({
      domain: 'generationsinc.org',
      twitter_handle: '@generations'
    })
  })
})
