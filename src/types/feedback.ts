type Feedback = {
  id: number,
  status: string,
  user_id: number,
  created_at: Date,
  updated_at: Date
}

type Screenshot = {
  id: number,
  name: string
  screenshot_file: string,
  feedback_id: number,
  created_at: Date,
  updated_at: Date
}
