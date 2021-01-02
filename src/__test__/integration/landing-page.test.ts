// tslint:disable:no-expression-statement no-let
import { expect } from 'chai'
import { DOMWindow } from 'jsdom'
import { createMocks } from '../mocks'


describe('landing page', () => {
  const mocks = createMocks()

  let window: DOMWindow
  before(async () => window = await mocks.getWindow('/'))

  it('has a header', () => {
    const style = window.getComputedStyle(window.document.querySelector('header')!)
    expect(style.paddingTop).to.equal('10px')
  })

  it('toggles whether the panels of accordion items are displayed on click', () => {
    const accordionItems = Array.from(window.document.querySelectorAll('.acc-item')) as ReadonlyArray<HTMLDivElement>

    for (const item of accordionItems) {
      const panel = item.querySelector('.panel') as HTMLDivElement
      expect(window.getComputedStyle(panel).display).to.equal('none')
    }

    accordionItems[0].click()
    expect(window.getComputedStyle(accordionItems[0].querySelector('.panel')!).display).to.equal('block')

    accordionItems[1].click()
    expect(window.getComputedStyle(accordionItems[0].querySelector('.panel')!).display).to.equal('none')
  })
})
