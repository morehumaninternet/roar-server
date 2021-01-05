import { IRouterContext } from 'koa-router'


export function getCurrentUser(ctx: IRouterContext): SerializedUser {
  const user: Maybe<SerializedUser> = ctx.session?.passport?.user
  if (!user) {
    throw { status: 401, message: 'Unauthorized' }
  }
  return user
}
