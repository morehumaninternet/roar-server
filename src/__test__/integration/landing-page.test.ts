// tslint:disable:no-expression-statement no-let
import { expect } from 'chai'
import { DOMWindow } from 'jsdom'
import { sample } from 'lodash'
import * as sinon from 'sinon'
import { createMocks } from '../mocks'

describe('landing page', () => {
  const mocks = createMocks()

  let window: DOMWindow
  before(async () => (window = await mocks.getWindow('/')))

  // SinonFakeTimers helps us travel in time.
  // Specifically, we want to make the tests run faster, so we speed up setTimeout timers.
  let clock: sinon.SinonFakeTimers
  before(() => (clock = sinon.useFakeTimers()))
  after(() => clock.restore())

  it('has a header', () => {
    const style = window.getComputedStyle(window.document.querySelector('header')!)
    expect(style.paddingTop).to.equal('10px')
  })

  it('toggles whether the text of accordion items are displayed on click', () => {
    const accordionItems = Array.from(window.document.querySelectorAll('.accordion_item')) as ReadonlyArray<HTMLDivElement>

    for (const item of accordionItems) {
      const accordionText = item.querySelector('.accordion__text') as HTMLDivElement
      expect(window.getComputedStyle(accordionText).display).to.equal('none')
    }

    const someAccordionItem = sample(accordionItems)

    someAccordionItem.click()
    expect(window.getComputedStyle(someAccordionItem.querySelector('.accordion__text')!).display).to.equal('block')
  })

  it('sends a request and displays the results for 5 seconds when subscribing', done => {
    // Return a 'subscribed successfully' when sending a request to the server
    window.fetch = sinon.stub().resolves({ ok: true })

    const emailInput = window.document.querySelector('.newsletter__email')! as HTMLInputElement
    const subscribeButton = window.document.querySelector('.newsletter__submit') as HTMLButtonElement
    const resultDiv = window.document.querySelector('.newsletter__result')!
    expect(window.getComputedStyle(resultDiv!).display).to.equal('none')

    emailInput.value = 'test@testing.com'

    // Listen to attribute changes on the results div.
    // When the user clicks on the submit button, the results
    // should appear on the screen for 5 seconds and then disappear.
    const mutationObserver = new window.MutationObserver(() => {
      expect(window.getComputedStyle(resultDiv).display).to.equal('block')
      clock.tick(5000)
      expect(window.getComputedStyle(resultDiv).display).to.equal('none')
      mutationObserver.disconnect()
      done()
    })
    mutationObserver.observe(resultDiv, { attributes: true })
    subscribeButton.click()
  })
})
