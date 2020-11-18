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
  host: string,
  imagesData: ReadonlyArray<FeedbackImageData>,
  url: string
}

const saveFeedback = async ({ user, status, host, imagesData, url }: SaveFeedbackParam) => {
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
INSERT INTO feedback_images (feedback_id, name, file, file_extension)
      VALUES ${Array(imagesData.length).fill(
    '((select id from inserted_feedback), ?, ?, ?)'
  ).join(',')
    }
`

  const defaultQueryArgs: ReadonlyArray<any> = [host, user.id, status, url]
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
