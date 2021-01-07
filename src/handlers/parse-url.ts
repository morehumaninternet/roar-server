import { parseDomain } from 'parse-domain'

const massageUrlString = (urlString: string) => {
  const hasProtocol = urlString.startsWith('https://') || urlString.startsWith('http://')
  const withProtocol = hasProtocol ? urlString : `https://${urlString}`
  const withoutWww = withProtocol.replace(/^(https?:\/\/)www\.(.*)$/, '$1$2')
  return withoutWww
}

export const urlOf = (urlString: string): URL => {
  try {
    return new URL(massageUrlString(urlString))
  } catch {
    throw { status: 400, message: `${urlString} must be an URL` }
  }
}

export const domainOf = (urlString: string): string => {
  const { host } = urlOf(urlString)
  return host.replace(/^www\./, '')
}

const parseHost = (url: URL): { host: string; subdomain?: string; hostWithoutSubDomain: string } => {
  const parsed = parseDomain(url)

  const tld = parsed.topLevelDomains.join('.')

  return {
    host: url.host,
    subdomain: parsed.subDomains.length ? parsed.subDomains.join('.') : undefined,
    hostWithoutSubDomain: `${parsed.domain}.${tld}`,
  }
}

export const parseUrl = (urlString: string): ParsedUrl => {
  const url = urlOf(urlString)
  const { host, subdomain, hostWithoutSubDomain } = parseHost(url)
  const [, firstPath] = url.pathname.split('/')
  const fullWithFirstPath = firstPath ? `${host}/${firstPath}` : host
  return { host, hostWithoutSubDomain, subdomain, fullWithFirstPath, firstPath: firstPath || undefined }
}
