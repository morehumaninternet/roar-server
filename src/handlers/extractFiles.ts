import { IRouterContext } from 'koa-router'
import { File } from 'formidable'

export const extractFiles = (ctx: IRouterContext, fieldName: string): ReadonlyArray<File> => {
  const { files } = ctx.request
  if (!files) return []
  const maybeFile = files[fieldName]
  if (!maybeFile) return []
  return Array.isArray(maybeFile) ? maybeFile : [maybeFile]
}
