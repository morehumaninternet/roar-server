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

  before(() =>
    db('websites').insert([
      { url: 'google.com', twitter_handle: '@Google' },
      { url: 'docs.google.com', twitter_handle: '@googledocs' },
      { url: 'google.com/maps', twitter_handle: '@googlemaps' },
    ])
  )

  beforeEach(() => (clearBitGetTwitterHandle = sinon.stub(clearbit, 'getTwitterHandle').throws()))
  afterEach(() => sinon.restore())

  it('400s when GET does not include domain', done => {
    mocks.agent.get('/v1/website').expect(400).end(done)
  })

  it('200s responding with the twitter_handle pulled from the appropriate meta tag when not previously found', async () => {
    const response = await mocks.agent.get('/v1/website?domain=github.com').expect(200)

    expect(response.body).to.eql({
      matching_url: 'github.com',
      domain: 'github.com',
      twitter_handle: '@github',
    })
  })

  it('200s responding with the twitter_handle pulled from the database when previously found', async () => {
    sinon.stub(axios, 'get').throws('Should not be called')

    const response = await mocks.agent.get('/v1/website?domain=github.com').expect(200)

    expect(response.body).to.eql({
      matching_url: 'github.com',
      domain: 'github.com',
      twitter_handle: '@github',
    })
  })

  it('404s when the website does not exist', done => {
    mocks.agent.get('/v1/website?domain=alwejalkwjeklaweklawe.com').expect(404).end(done)
  })

  it('200s with the twitter handle from clearbit if the website HTML does not have a meta tag with the twitter handle', async () => {
    clearBitGetTwitterHandle.resolves('@generations')

    const response = await mocks.agent.get('/v1/website?domain=https://generationsinc.org').expect(200)

    expect(response.body).to.eql({
      matching_url: 'generationsinc.org',
      domain: 'generationsinc.org',
      twitter_handle: '@generations',
    })
  })

  it('works for google docs', async () => {
    const response = await mocks.agent.get('/v1/website?url=https://docs.google.com').expect(200)

    expect(response.body).to.eql({
      matching_url: 'docs.google.com',
      domain: 'docs.google.com',
      twitter_handle: '@googledocs',
    })
  })

  it('works for google docs with a path', async () => {
    const response = await mocks.agent.get('/v1/website?url=https://docs.google.com/somedoc').expect(200)

    expect(response.body).to.eql({
      matching_url: 'docs.google.com',
      domain: 'docs.google.com',
      twitter_handle: '@googledocs',
    })
  })

  it('works for google', async () => {
    const response = await mocks.agent.get('/v1/website?url=google.com').expect(200)

    expect(response.body).to.eql({
      matching_url: 'google.com',
      domain: 'google.com',
      twitter_handle: '@Google',
    })
  })

  it('works for google maps', async () => {
    const response = await mocks.agent.get('/v1/website?url=google.com/maps').expect(200)

    expect(response.body).to.eql({
      matching_url: 'google.com/maps',
      domain: 'google.com',
      twitter_handle: '@googlemaps',
    })
  })
})
