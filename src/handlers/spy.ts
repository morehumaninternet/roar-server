// tslint:disable:no-expression-statement no-let
const Wappalyzer = require('wappalyzer')
import Router = require('koa-router')

type Category = {
  id: number
  slug: string
  name: string
}

type Technology = {
  slug: string
  name: string
  confidence: number
  version: string | null
  icon: string
  website: string
  cpe: string | null
  categories: ReadonlyArray<Category>
}

const options = {
  debug: false,
  delay: 0,
  headers: {},
  maxDepth: 2,
  maxUrls: 10,
  maxWait: 5000,
  recursive: true,
  probe: true,
  userAgent: 'Wappalyzer',
  htmlMaxCols: 2000,
  htmlMaxRows: 2000,
}

const wappalyzer = new Wappalyzer(options)

export async function getSpies(ctx: Router.IRouterContext): Promise<any> {
  const params = ctx.query
  const url = params && params.url

  if (!url) {
    return { statusCode: 422, body: JSON.stringify({ message: 'Missing attribute - url' }) }
  }
  let technology_names
  try {
    await wappalyzer.init()

    // Optionally set additional request headers
    const headers = {}
    const site = await wappalyzer.open(url, headers)

    // Optionally capture and output errors
    site.on('error', console.error)
    const results = await site.analyze()

    const technologies: ReadonlyArray<Technology> = results.technologies

    const analytics_technologies = technologies.filter((tech: Technology) => {
      return tech.categories.some((category: Category) => category.name === 'Analytics')
    })
    technology_names = analytics_technologies.map((tech: Technology) => tech.name)
    // console.log(JSON.stringify(technology_names, null, 2))
  } catch (error) {
    // console.error(error)
    return { statusCode: 400, body: JSON.stringify({ message: 'something went wrong' }) }
  }
  await wappalyzer.destroy()
  return { statusCode: 200, body: JSON.stringify({ spies: technology_names }) }
}
