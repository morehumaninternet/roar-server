type Feedback = {
  id: number,
  status: string,
  user_id: number,
  website_id: number,
  tweet_url?: string,
  created_at: Date,
  updated_at: Date
}

type FeedbackImageData = {
  name: string,
  file: Buffer,
  file_extension: string
}

type FeedbackImage = FeedbackImageData & {
  id: number,
  feedback_id: number,
  created_at: Date,
  updated_at: Date
}
