// tslint:disable:no-expression-statement no-let
import { expect } from 'chai'
import { DOMWindow } from 'jsdom'
import { createMocks } from '../mocks'


describe('welcome page', () => {
  const mocks = createMocks()

  let window: DOMWindow
  before(async () => window = await mocks.getWindow('/welcome'))

  it('has a header', () => {
    const style = window.getComputedStyle(window.document.querySelector('header')!)
    expect(style.paddingTop).to.equal('10px')
  })

  it('has a sign in link', () => {
    const loginLink = window.document.querySelector('a[href="/v1/auth/twitter"]')!
    expect(loginLink.innerHTML).to.include('Log in with Twitter')
  })
})
