import { extname } from 'path'
import { promisify } from 'util'
import { readFile as fsReadFile } from 'fs'
import { File } from 'formidable'
import db from './db'

const readFile = promisify(fsReadFile)

type SaveFeedbackParam = {
  user: SerializedUser,
  status: string,
  host: string,
  imagesData: ReadonlyArray<FeedbackImageData>,
  url: string
}

const saveFeedbackWebsite = async (host: string) => {
  // tslint:disable-next-line: no-let
  let [website] = await db<Website>('websites').select().where({ domain: host })
  if (!website) {
    // tslint:disable-next-line: no-expression-statement
    [website] = await db<Website>('Websites').insert({ domain: host }).returning('*')
  }

  return website
}

const saveFeedbackImages = async (imagesData: ReadonlyArray<FeedbackImageData>, feedback: Feedback) => {
  const feedbackImageDBData = await Promise.all(
    imagesData.map(async imageData => {
      return { ...imageData, feedback_id: feedback.id }
    })
  )
  // tslint:disable-next-line: no-expression-statement
  return db<FeedbackImage>('feedback_images').insert(feedbackImageDBData).returning('*')
}

const saveFeedback = async ({ user, status, host, imagesData, url }: SaveFeedbackParam) => {
  const website = await saveFeedbackWebsite(host)
  const [feedback] = await db<Feedback>('feedback').insert({ status, user_id: user.id, website_id: website.id, tweet_url: url }).returning('*')
  // tslint:disable-next-line: no-expression-statement
  await saveFeedbackImages(imagesData, feedback)
}

const extractImageData = (screenshots: ReadonlyArray<File>): Promise<ReadonlyArray<FeedbackImageData>> => {
  return Promise.all(
    screenshots.map(async screenshot => {
      const fileBuffer = await readFile(screenshot.path)
      return { name: screenshot.name, file: fileBuffer, file_extension: extname(screenshot.name) }
    })
  )
}

export { saveFeedback, extractImageData }
