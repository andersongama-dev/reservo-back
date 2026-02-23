import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class InjectAuthFromCookieMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const token = ctx.request.cookie('access_token')

    if (token) {
      ctx.request.headers()['authorization'] = `Bearer ${token}`
    }

    return next()
  }
}
