import User from '#models/user'
import { registerUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({}: HttpContext) {}

  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(registerUserValidator)

      const user = await User.create(data)

      if (!user) {
        return response.badRequest({
          message: 'Erro ao encontrar usuario',
        })
      }

      const token = await User.accessTokens.create(user)

      const rawToken = token.value!.release()

      return response.ok({
        token: rawToken,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Erro ao criar usuário',
      })
    }
  }

  async show({ auth }: HttpContext) {
    const user = auth.user

    return {
      user: user,
    }
  }

  async edit({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Não autenticado' })
    }

    const data = request.only(['user_name', 'user_email', 'user_password', 'user_role'])

    user.merge(data)
    await user.save()

    return response.ok({
      user: user,
    })
  }

  async destroy({ auth, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Não autenticado' })
    }

    user.merge({
      user_status: false,
    })

    await user.save()

    return response.ok({ message: 'Usuário desativado com sucesso' })
  }
}
