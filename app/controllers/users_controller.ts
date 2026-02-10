import User from '#models/user'
import { loginUserValidator, registerUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
//import hash from '@adonisjs/core/services/hash'

export default class UsersController {
  async index({}: HttpContext) {}

  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(registerUserValidator)

      await User.create(data)

      return { message: 'Registro bem sucedido' }
    } catch (error) {
      return response.badRequest({
        message: 'Erro ao criar usuário',
      })
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(loginUserValidator)

      const user = await User.verifyCredentials(data.user_email, data.user_password)

      await User.accessTokens.create(user)

      return {
        message: 'Login bem sucedido',
      }
    } catch (error) {
      return response.internalServerError({
        message: 'Não foi possivel realizar o login',
      })
    }
  }

  /**
   * Show individual record
   */
  // async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  // async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  // async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  // async destroy({ params }: HttpContext) {}
}
