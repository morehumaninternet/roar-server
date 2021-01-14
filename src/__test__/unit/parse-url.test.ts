// tslint:disable:no-let no-expression-statement
import { expect } from 'chai'
import { parseUrl } from '../../parse-url'

describe('parse-url', () => {
  it('works for uk addresses', () => {
    expect(parseUrl('www.google.co.uk')).to.eql({
      host: 'google.co.uk',
      hostWithoutSubdomain: 'google.co.uk',
      subdomain: '',
      fullWithFirstPath: 'google.co.uk',
      firstPath: '',
    })

    expect(parseUrl('cool.google.co.uk/search')).to.eql({
      host: 'cool.google.co.uk',
      hostWithoutSubdomain: 'google.co.uk',
      subdomain: 'cool',
      fullWithFirstPath: 'cool.google.co.uk/search',
      firstPath: 'search',
    })
  })

  it('throws for localhost', () => {
    let err
    try {
      parseUrl('localhost:5004')
    } catch (e) {
      err = e
    }
    expect(err).to.eql({ status: 400, message: 'Must specify a listed hostname' })
  })
})
