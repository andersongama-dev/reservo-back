import Barber from '#models/barber'
import Barbershop from '#models/barbershop'
import Service from '#models/service'
import type { HttpContext } from '@adonisjs/core/http'

export default class ServicesController {
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Não autenticado' })
    }

    const data = await request.only(['service_name', 'service_duration', 'service_price'])

    const barber = await Barber.findBy('user_id', user.user_id)

    if (!barber) {
      return response.unauthorized({ message: 'Você não é um barbeiro' })
    }

    const barbershop = await Barbershop.find(barber.barber_id)

    if (barbershop != null) {
      await Service.create({
        service_name: data.service_name,
        service_duration: data.service_duration,
        service_price: data.service_price,
        barbershop_id: barbershop.barbershop_id,
      })

      return response.created({})
    } else {
      await Service.create({
        service_name: data.service_name,
        service_duration: data.service_duration,
        service_price: data.service_price,
        barber_id: barber.barber_id,
      })

      return response.created({})
    }
  }
}
