type Feedback = {
  id: number,
  status: string,
  user_id: number,
  website_id: number,
  tweet_url?: string,
  created_at: Date,
  updated_at: Date
}

type FeedbackImageInsert = {
  name: string
  file: Buffer,
  feedback_id: number,
}

type FeedbackImage = FeedbackImageInsert & {
  id: number,
  created_at: Date,
  updated_at: Date
}
