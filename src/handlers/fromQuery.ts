import { IRouterContext } from 'koa-router'


export const fromQuery = (ctx: IRouterContext, fieldName: string, type: 'string' = 'string') => {
  const value = ctx.request.query[fieldName]
  if (!value) {
    throw { status: 400, message: `Body must include ${fieldName}, a ${type}` }
  }
  return value
}
