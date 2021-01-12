// tslint:disable:no-let
// tslint:disable:no-expression-statement
import { expect } from 'chai'
import * as sinon from 'sinon'
import axios from 'axios'
import * as clearbit from '../../external-apis/clearbit'
import { createMocks } from '../mocks'
import db from '../../db'

describe('/website', () => {
  const mocks = createMocks()
  let clearBitGetTwitterHandle: sinon.SinonStub

  before(async () => {
    await db('websites').insert([
      { domain: 'google.com', twitter_handle: '@Google' },
      { domain: 'google.com', subdomain: 'docs', path: null, twitter_handle: '@googledocs' },
      { domain: 'google.com', subdomain: null, path: 'maps', twitter_handle: '@googlemaps' },
      { domain: 'foo.github.io', twitter_handle: '@foo_github' },
    ])
  })

  beforeEach(() => (clearBitGetTwitterHandle = sinon.stub(clearbit, 'getTwitterHandle').throws()))
  afterEach(() => sinon.restore())

  it('400s when GET does not include domain', done => {
    mocks.agent.get('/v1/website').expect(400).end(done)
  })

  it('200s responding with the twitter_handle pulled from the appropriate meta tag when not previously found', async () => {
    const response = await mocks.agent.get('/v1/website?domain=github.com').expect(200)

    expect(response.body).to.eql({
      domain: 'github.com',
      twitter_handle: '@github',
      non_default_twitter_handles: [],
    })
  })

  it('200s responding with the twitter_handle pulled from the database when previously found', async () => {
    sinon.stub(axios, 'get').throws('Should not be called')

    const response = await mocks.agent.get('/v1/website?domain=github.com').expect(200)

    expect(response.body).to.eql({
      domain: 'github.com',
      twitter_handle: '@github',
      non_default_twitter_handles: [],
    })
  })

  it('404s when the website does not exist', done => {
    mocks.agent.get('/v1/website?domain=alwejalkwjeklaweklawe.com').expect(404).end(done)
  })

  it('200s with the twitter handle from clearbit if the website HTML does not have a meta tag with the twitter handle', async () => {
    clearBitGetTwitterHandle.resolves('@generations')

    const response = await mocks.agent.get('/v1/website?domain=https://generationsinc.org').expect(200)

    expect(response.body).to.eql({
      domain: 'generationsinc.org',
      twitter_handle: '@generations',
      non_default_twitter_handles: [],
    })
  })

  it('works for google, no matter which domain is specified', async () => {
    const response = await mocks.agent.get('/v1/website?domain=https://docs.google.com').expect(200)

    expect(response.body).to.eql({
      domain: 'google.com',
      twitter_handle: '@Google',
      non_default_twitter_handles: [
        { subdomain: 'docs', path: null, twitter_handle: '@googledocs' },
        { subdomain: null, path: 'maps', twitter_handle: '@googlemaps' },
      ],
    })
  })

  // https://github.com/peerigon/parse-domain#%EF%B8%8F-effective-tlds--tlds-acknowledged-by-icann
  it('works for github.io addresses which act as a private domain name registrar', async () => {
    const response = await mocks.agent.get('/v1/website?domain=https://dandanua.github.io').expect(200)

    expect(response.body).to.eql({
      domain: 'dandanua.github.io',
      twitter_handle: '@DanyloYakymenko',
      non_default_twitter_handles: [],
    })
  })
})
