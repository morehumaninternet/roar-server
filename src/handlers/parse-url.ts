export const urlOf = (urlString: string): URL => {
  try {
    return new URL(urlString)
  } catch {
    try {
      return new URL(`https://${urlString}`)
    } catch {
      throw { status: 400, message: `${urlString} must be an URL` }
    }
  }
}

export const domainOf = (urlString: string): string => {
  const { host } = urlOf(urlString)
  return host.replace(/^www\./, '')
}

// In the United Kingdom, the second-level domain names are standard and branch off from the top-level domain.
// So, if we encounter we google.co.uk
// https://en.wikipedia.org/wiki/Subdomain#Uses
const ukSecondLevelDomains = new Set(['ac', 'co', 'gov', 'judiciary', 'ltd', 'me', 'mod', 'net', 'nhs', 'nic', 'org', 'parliament', 'plc', 'police', 'sch'])

const isUkSecondLevelDomain = (hostParts: ReadonlyArray<string>): boolean => {
  const [secondToLast, last] = hostParts.slice(-2)
  return last === 'uk' && ukSecondLevelDomains.has(secondToLast)
}

const parseHost = (url: URL): { host: string; subdomain?: string; hostWithoutSubDomain: string } => {
  const host = url.host.replace(/^www\./, '')

  const hostParts = host.split('.')

  if (hostParts.length < 2) {
    throw { status: 400, message: 'Expected a publicly facing url' }
  }

  if (hostParts.length === 2) {
    return { host, hostWithoutSubDomain: host }
  }

  const nonSubdomainStartsAt = isUkSecondLevelDomain(hostParts) ? 3 : 2
  const subdomainComponents = hostParts.length - nonSubdomainStartsAt

  if (!subdomainComponents) {
    return { host, hostWithoutSubDomain: host }
  }

  return {
    host,
    subdomain: hostParts.slice(0, subdomainComponents).join('.'),
    hostWithoutSubDomain: hostParts.slice(subdomainComponents).join('.'),
  }
}

export const parseUrl = (urlString: string): ParsedUrl => {
  const url = urlOf(urlString)
  const { host, subdomain, hostWithoutSubDomain } = parseHost(url)
  const [, firstPath] = url.pathname.split('/')
  const fullWithFirstPath = firstPath ? `${host}/${firstPath}` : host
  return { host, hostWithoutSubDomain, subdomain, fullWithFirstPath, firstPath: firstPath || undefined }
}
