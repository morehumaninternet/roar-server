export const hostOf = (url: string): string => {
  try {
    return (new URL(url)).host
  } catch {
    try {
      return (new URL(`https://${url}`)).host
    } catch {
      throw { status: 400, message: `${url} must be an URL` }
    }
  }
}

export const domainOf = (url: string): string => {
  const host = hostOf(url)
  return host.replace(/^www\./, '')
}
