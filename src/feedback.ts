import { extname } from 'path'
import { promisify } from 'util'
import { readFile as fsReadFile } from 'fs'
import { File } from 'formidable'
import { flatten } from 'lodash'
import db from './db'

const readFile = promisify(fsReadFile)

type SaveFeedbackParam = {
  user: SerializedUser,
  status: string,
  domain: string,
  imagesData: ReadonlyArray<FeedbackImageData>,
  url: string
}

// Only insert feedback_images if they exist.
// Otherwise, run a dummy select to satisfy SQL syntax constraints after a WITH statement
const imagesFeedbackSql = (imagesData: ReadonlyArray<FeedbackImageData>,) => {
  if (!imagesData.length) return 'SELECT 1'
  return `
    INSERT INTO feedback_images (feedback_id, name, file, file_extension)
        VALUES ${Array(imagesData.length).fill(
    '((select id from inserted_feedback), ?, ?, ?)'
  ).join(',')
    }
  `
}

// Saves feedback and feedback_images in the database, creating a website row if one doesn't already exist
const saveFeedback = async ({ user, status, domain, imagesData, url }: SaveFeedbackParam) => {

  const insertFeedbackSql = `
    WITH inserted_website(id) as (
      INSERT INTO websites(domain)
          VALUES (?)
      ON CONFLICT(domain) DO UPDATE SET domain=EXCLUDED.domain
        RETURNING id
    ),
    inserted_feedback(id) as (
      INSERT INTO feedback (user_id, website_id, status, tweet_url)
          VALUES (?, (SELECT id from inserted_website), ?, ?)
        RETURNING id
    )
    ${imagesFeedbackSql(imagesData)}
  `

  const defaultQueryArgs: ReadonlyArray<any> = [domain, user.id, status, url]
  const imagesQueryArgs = flatten(imagesData.map(imageData => [imageData.name, imageData.file, imageData.file_extension]))
  const queryArgs = defaultQueryArgs.concat(imagesQueryArgs)
  // tslint:disable-next-line: no-expression-statement
  await db.raw(insertFeedbackSql, queryArgs)
}

const extractImageData = (images: ReadonlyArray<File>): Promise<ReadonlyArray<FeedbackImageData>> => {
  return Promise.all(
    images.map(async image => {
      const fileBuffer = await readFile(image.path)
      return { name: image.name, file: fileBuffer, file_extension: extname(image.name) }
    })
  )
}

export { saveFeedback, extractImageData }
