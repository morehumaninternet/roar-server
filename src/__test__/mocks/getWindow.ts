/*
  Load a jsdom.DOMWindow
*/
// tslint:disable:no-expression-statement
import * as request from 'supertest'
import { JSDOM, DOMWindow, ResourceLoader } from 'jsdom'


const fakeUrl = 'https://test-roar.morehumaninternet.org'

function loadLinkOrScript(el: HTMLLinkElement | HTMLScriptElement): Promise<void> {
  const timeoutError = new Error('timeout')
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(timeoutError), 5000)
    el.addEventListener('load', () => {
      clearTimeout(timeout)
      resolve()
    })
  })
}

function loadAllLinksAndScripts(window: DOMWindow): Promise<any> {
  const links: ReadonlyArray<HTMLLinkElement | HTMLScriptElement> = Array.from(window.document.getElementsByTagName('link'))
  const scripts = Array.from(window.document.getElementsByTagName('script'))
  const toLoad = links.concat(scripts)
  return Promise.all(toLoad.map(loadLinkOrScript))
}

export async function getWindow(agent: request.SuperTest<request.Test>, path: string): Promise<DOMWindow> {
  const response = await agent.get(path)

  const { window } = new JSDOM(response.text, {
    url: fakeUrl,
    pretendToBeVisual: true,
    runScripts: 'dangerously',
    resources: Object.assign(new ResourceLoader(), {
      // Fetch resources from the given agent for urls starting with our fake server url
      // Return blank files for all other resources
      fetch(url: string): Promise<Buffer> {
        if (url.startsWith(fakeUrl)) {
          return agent.get(url.replace(fakeUrl, '')).then(response => Buffer.from(response.text))
        }
        return Promise.resolve(Buffer.from(''))
      }
    }),
  })

  await loadAllLinksAndScripts(window)
  return window
}

