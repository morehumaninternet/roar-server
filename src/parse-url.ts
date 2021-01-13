import { parseDomain } from 'parse-domain'

// Add `https://` as the protocol if none exists. =
export const massageUrlString = (urlString: string): string => {
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

const parseHost = (url: URL): { host: string; subdomain?: string; hostWithoutSubdomain: string } => {
  const parsed = parseDomain(url.hostname)

  if (parsed.type === 'INVALID') {
    throw {
      status: 400,
      message: parsed.errors[0].message,
    }
  } else if (parsed.type !== 'LISTED') {
    throw {
      status: 400,
      message: 'Must specify a listed hostname',
    }
  }

  const tld = parsed.topLevelDomains.join('.')

  return {
    host: url.host,
    subdomain: parsed.subDomains.length ? parsed.subDomains.join('.') : undefined,
    hostWithoutSubdomain: `${parsed.domain}.${tld}`,
  }
}

export const parseUrl = (urlString: string): ParsedUrl => {
  const url = urlOf(urlString)
  const { host, subdomain, hostWithoutSubdomain } = parseHost(url)
  const [, firstPath] = url.pathname.split('/')
  const fullWithFirstPath = firstPath ? `${host}/${firstPath}` : host
  return { host, hostWithoutSubdomain, subdomain, fullWithFirstPath, firstPath: firstPath || undefined }
}
