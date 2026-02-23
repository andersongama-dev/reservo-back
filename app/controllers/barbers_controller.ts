import type { HttpContext } from '@adonisjs/core/http'
import { generateCode } from '../utils/generate_code.js'
import Barber from '#models/barber'

export default class BarbersController {
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Não autenticado' })
    }

    const functionBarber = request.only(['barber_function'])

    if (!functionBarber.barber_function) {
      return response.badRequest({ message: 'barber_function é obrigatório' })
    }

    let code = generateCode()

    let verify = await Barber.findBy('invitation_code', code)

    let attempts = 0

    while (verify != null && attempts < 20) {
      code = generateCode()
      verify = await Barber.findBy('invitation_code', code)
      attempts++
    }

    if (verify != null) {
      return response.internalServerError({
        message: 'Não foi possível gerar código único',
      })
    }

    await Barber.create({
      user_id: user.user_id,
      barber_function: functionBarber.barber_function,
      invitation_code: code,
    })

    return response.created({})
  }

  async myfunction({ auth, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized('Não autenticado')
    }

    const barber = await Barber.findBy('user_id', user.user_id)

    if (!barber) {
      return response.unauthorized('Você não é um barbeiro')
    }

    return response.ok({
      barber_function: barber.barber_function,
    })
  }
}
