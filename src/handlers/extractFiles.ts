import { IRouterContext } from 'koa-router'
import { File } from 'formidable'


export const extractFiles = (ctx: IRouterContext, fieldName: string): ReadonlyArray<File> => {
  const maybeFile: undefined | File | ReadonlyArray<File> = ctx.request.files?.[fieldName]
  if (!maybeFile) return []
  return Array.isArray(maybeFile) ? maybeFile : [maybeFile]
}
