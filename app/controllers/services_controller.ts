import Barber from '#models/barber'
import Barbershop from '#models/barbershop'
import Service from '#models/service'
import { HttpContext } from '@adonisjs/core/http'

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

  async listServices({ auth, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Não autenticado!',
      })
    }

    const barber = await Barber.findBy('user_id', user.user_id)

    if (barber == null) {
      return response.unauthorized({
        message: 'Você não é um barberio',
      })
    }

    if (barber.barber_function == 'owner') {
      const barbershop = await Barbershop.findBy('barbershop_id', barber.barbershop_id)

      if (barbershop != null) {
        const services = await Service.query().where('barbershop_id', barbershop.barbershop_id)

        return response.ok({
          services: services,
        })
      }
    } else if (barber.barber_function == 'professional') {
      const services = await Service.query().where('barber_id', barber.barber_id)

      return response.ok({
        services: services,
      })
    } else {
      return response.unauthorized('Você não pode criar serviços')
    }
  }

  async update({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized('Não autenticado')
    }

    const barber = await Barber.findBy('user_id', user.user_id)

    if (!barber) {
      return response.unauthorized('Você não é um barbeiro')
    }

    if (barber.barber_function == 'owner' || barber.barber_function == 'professional') {
    }

    const data = request.only([
      'service_id',
      'service_name',
      'service_time',
      'service_price',
      'service_status',
    ])

    const service = await Service.findBy('service_id', data.service_id)

    if (!service) {
      return response.notFound('Serviço não encotrado')
    }

    service.merge({
      service_name: data.service_name,
      service_price: data.service_price,
      service_duration: data.service_time,
      service_status: data.service_status,
    })

    service.save()

    return response.ok('Serviço editado com sucesso')
  }

  async disable({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized('Não autenticado')
    }

    const barber = await Barber.findBy('user_id', user.user_id)

    if (!barber) {
      return response.unauthorized('Você não é um barbeiro')
    }

    const data = request.only(['service_id'])

    const service = await Service.findBy('service_id', data.service_id)

    if (!service) {
      return response.notFound('Serviço não encotrado')
    }

    service.merge({
      service_status: false,
    })

    service.save()

    return response.ok('Serviço desativado com sucesso')
  }

  async delete({ auth, params, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized('Não autenticado')
    }

    const barber = await Barber.findBy('user_id', user.user_id)

    if (!barber) {
      return response.unauthorized('Você não é um barbeiro')
    }

    const service = await Service.findBy('service_id', params.id)

    if (!service) {
      return response.notFound('Serviço não encotrado')
    }

    await service.delete()

    return response.ok('Serviço deletado com sucesso')
  }
}
