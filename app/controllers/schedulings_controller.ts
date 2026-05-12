import Barber from '#models/barber'
import Barbershop from '#models/barbershop'
import Service from '#models/service'
import Scheduling from '#models/scheduling'
import { HttpContext } from '@adonisjs/core/http'

export default class SchedulingsController {
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Não autenticado' })
    }

    const data = await request.only(['service_id', 'scheduled_time'])

    const barber = await Barber.findBy('user_id', user.user_id)

    if (!barber) {
      return response.unauthorized({ message: 'Você não é um barbeiro' })
    }

    const service = await Service.find(data.service_id)

    if (!service) {
      return response.badRequest({ message: 'Serviço não encontrado' })
    }

    const barbershop = await Barbershop.find(service.barbershop_id)

    if (barbershop != null) {
      await Scheduling.create({
        scheduling_date: data.scheduled_time,
        service_id: data.service_id,
        user_id: user.user_id,
        barber_id: barber.barber_id,
        barbershop_id: service.barbershop_id,
      })

      return response.created({ message: 'Agendamento criado para barbearia' })
    } else {
      await Scheduling.create({
        scheduling_date: data.scheduled_time,
        service_id: data.service_id,
        user_id: user.user_id,
        barber_id: barber.barber_id,
      })

      return response.created({ message: 'Agendamento criado para barbeiro' })
    }
  }

  async listSchedulings({ auth, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Não autenticado!',
      })
    }

    const barber = await Barber.findBy('user_id', user.user_id)

    if (!barber) {
      return response.unauthorized({
        message: 'Você não é um barbeiro',
      })
    }

    const schedulings = await Scheduling.query()
      .where('barber_id', barber.barber_id)
      .preload('service')
      .preload('user')
      .preload('barbershop')
      .orderBy('scheduling_date', 'asc')

    return response.ok(schedulings)
  }
}
