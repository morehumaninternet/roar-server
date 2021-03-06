type Maybe<T> = T | null | undefined

type Done<T> = (err?: any, result?: T) => void

type Feedback = {
  id: number
  status: string
  user_id: number
  website_id: number
  tweet_url: string
  created_at: Date
  updated_at: Date
}

type FeedbackImageData = {
  name: string
  file: Buffer
  file_extension: string
}

type FeedbackImage = FeedbackImageData & {
  id: number
  feedback_id: number
  created_at: Date
  updated_at: Date
}

type UserInsert = {
  twitter_id: string
  twitter_handle: string
  display_name: string
  photo?: string
  email?: string
  created_at: Date
  updated_at: Date
}

type User = UserInsert & {
  id: number
}

type SerializedUser = {
  id: number
  photo?: string
  token: string
  tokenSecret: string
}

type ParsedUrl = {
  host: string
  hostWithoutSubdomain: string
  subdomain?: string
  firstPath?: string
  fullWithFirstPath: string
}

type WebsiteNonDefaultTwitterHandle = {
  subdomain: string
  path: string
  twitter_handle: string
}

type Website = {
  id: number
  domain: string
  twitter_handle: null | string
  non_default_twitter_handles: ReadonlyArray<WebsiteNonDefaultTwitterHandle>
  last_checked_website_html_at?: Date
  last_checked_clearbit_at?: Date
  created_at: Date
  updated_at: Date
}

type ParseDomainListed = {
  type: 'LISTED'
  hostname: string
  labels: string
  icann: {
    subDomains: ReadonlyArray<string>
    domain: string
    topLevelDomains: ReadonlyArray<string>
  }
  subDomains: ReadonlyArray<string>
  domain: string
  topLevelDomains: ReadonlyArray<string>
}

type ParseDomainError = {
  type: 'INVALID'
  errors: ReadonlyArray<{
    type: string
    message: string
  }>
}

type ParseDomainResult = ParseDomainListed | ParseDomainError | { type: 'IP' } | { type: 'RESERVED' } | { type: 'NOT_LISTED' }
declare module 'parse-domain' {
  export function parseDomain(hostname: string): ParseDomainResult
}
