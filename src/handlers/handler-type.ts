import { IRouterContext } from 'koa-router'

export type Handler<T> = (ctx: IRouterContext) => Promise<T extends undefined ? { status: 200 | 201 } : { status: 200 | 201; body: T }>
