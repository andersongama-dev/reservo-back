import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createSessionValidator } from '#validators/session'

export default class SessionRsController {
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createSessionValidator)

    const user = await User.verifyCredentials(data.user_email, data.user_password)

    const token = await User.accessTokens.create(user)

    response.cookie('access_token', token.value!.release(), {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    })

    return response.ok({})
  }

  async destroy({ response, auth }: HttpContext) {
    const user = auth.user!

    await User.accessTokens.delete(user, user?.currentAccessToken.identifier)

    response.clearCookie('access_token')

    return response.status(203)
  }
}
