import { promisify } from 'util'
import { readFile as fsReadFile } from 'fs'
import { File } from 'formidable'
import db from './db'

const readFile = promisify(fsReadFile)

const saveFeedbackWebsite = async (host: string) => {
  // tslint:disable-next-line: no-let
  let [website] = await db<Website>('websites').select().where({ domain: host })
  if (!website) {
    // tslint:disable-next-line: no-expression-statement
    [website] = await db<Website>('Websites').insert({ domain: host }).returning('*')
  }

  return website
}

const saveFeedbackImages = async (screenshots: ReadonlyArray<File>, feedback: Feedback) => {
  const feedbackImageDBData: ReadonlyArray<FeedbackImageInsert> = await Promise.all(
    screenshots.map(async screenshot => {
      const FileBuffer = await readFile(screenshot.path)
      return { name: screenshot.name, file: FileBuffer, feedback_id: feedback.id }
    })
  )
  // tslint:disable-next-line: no-expression-statement
  const feedbackImages = await db<FeedbackImage>('feedback_images').insert(feedbackImageDBData).returning('*')
  return feedbackImages
}

const saveFeedback = async (user: SerializedUser, status: string, host: string, screenshots: ReadonlyArray<File>) => {
  const website = await saveFeedbackWebsite(host)
  const [feedback] = await db<Feedback>('feedbacks').insert({ status, user_id: user.id, website_id: website.id }).returning('*')
  const feedbackImages = await saveFeedbackImages(screenshots, feedback)
  return { website, feedback, feedbackImages }
}

const updateTweetURL = (feedback: Feedback, url: string) => {
  return db('feedbacks').where({ id: feedback.id }).update({ tweet_url: url })
}

export { saveFeedback, updateTweetURL }
