type UserInsert = {
  twitter_id: string,
  twitter_handle: string
  display_name: string,
  photo?: string,
  email?: string,
  created_at: Date,
  updated_at: Date
}

type User = UserInsert & {
  id: number
}