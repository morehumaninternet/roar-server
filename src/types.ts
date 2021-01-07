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
  hostWithoutSubDomain: string
  subdomain?: string
  firstPath?: string
  fullWithFirstPath: string
}

type Website = {
  id: number
  domain: string
  twitter_handle?: string
  last_checked_website_html_at?: Date
  last_checked_clearbit_at?: Date
  created_at: Date
  updated_at: Date
}

type ParsedDomain = {
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

declare module 'parse-domain' {
  export function parseDomain(url: URL): ParsedDomain
}
