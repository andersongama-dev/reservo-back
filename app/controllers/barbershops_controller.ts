import type { HttpContext } from '@adonisjs/core/http'
import { generateCode } from '../utils/generate_code.js'
import Barbershop from '#models/barbershop'
import Barber from '#models/barber'

export default class BarbershopsController {
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Não auteticado' })
    }

    const data = request.only(['barbershop_name', 'barbershop_phone', 'barbershop_city'])

    let code = generateCode()

    let verify = await Barbershop.findBy('invitation_code', code)

    let attempts = 0

    while (verify != null && attempts < 20) {
      code = generateCode()
      verify = await Barbershop.findBy('invitation_code', code)
      attempts++
    }

    if (verify != null) {
      return response.internalServerError({
        message: 'Não foi possível gerar código único',
      })
    }

    const barber = await Barber.findBy('user_id', user.user_id)

    if (!barber) {
      return response.unauthorized({
        message: 'Você não é um barberio',
      })
    }

    if (barber.barbershop_id != null) {
      return response.unauthorized({
        message: 'Você já possui uma barbearia',
      })
    }

    const barbershop = await Barbershop.create({
      barbershop_name: data.barbershop_name,
      barbershop_phone: data.barbershop_phone,
      barbershop_city: data.barbershop_city,
      invitation_code: code,
    })

    barber.merge({
      barbershop_id: barbershop.barbershop_id,
      barber_function: 'owner',
    })
    await barber.save()

    return response.created({})
  }

  async show({ auth, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Não auteticado' })
    }

    const barber = await Barber.findBy('user_id', user.user_id)

    if (!barber || barber.barber_function !== 'owner') {
      return response.unauthorized({
        message: 'Você não tem autoização',
      })
    }

    const barbershop = await Barbershop.findBy('barbershop_id', barber.barbershop_id)

    if (!barbershop) {
      return response.notFound('Babearia não encotrada')
    }

    return response.ok({
      barber: barbershop,
    })
  }

  async edit({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Não auteticado' })
    }

    const data = request.only([
      'barbershop_id',
      'barbershop_name',
      'barbershop_phone',
      'barbershop_city',
    ])

    const barbershop = await Barbershop.findBy('barbershop_id', data.barbershop_id)

    if (!barbershop) {
      return response.notFound('Babearia não encotrada')
    }

    barbershop.merge({
      barbershop_name: data.barbershop_name,
      barbershop_phone: data.barbershop_phone,
      barbershop_city: data.barbershop_city,
    })

    await barbershop.save()

    return response.ok({})
  }
}
