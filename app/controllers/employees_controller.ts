import Barber from '#models/barber'
import Barbershop from '#models/barbershop'
import type { HttpContext } from '@adonisjs/core/http'

export default class EmployeesController {
  async all({ auth, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Não autetincado',
      })
    }

    const barber = await Barber.findBy('user_id', user.user_id)

    if (!barber || barber.barber_function !== 'owner') {
      return response.unauthorized({
        message: 'Voĉe não possui funcionarios',
      })
    }

    const barbershop = await Barbershop.find(barber.barbershop_id)

    if (!barbershop) {
      return response.notFound({
        message: 'Barbearia não encotrada',
      })
    }

    const employees = await Barber.query()
      .where('barbershop_id', barbershop.barbershop_id)
      .preload('user')

    return response.ok({
      employees,
    })
  }

  async dismiss({ auth, params, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Não autetincado',
      })
    }

    const barber = await Barber.findBy('user_id', user.user_id)

    if (!barber || barber.barber_function !== 'owner') {
      return response.unauthorized({
        message: 'Voĉe não pode demitir funcionarios',
      })
    }

    const barbershop = await Barbershop.find(barber.barbershop_id)

    if (!barbershop) {
      return response.notFound({
        message: 'Barbearia não encotrada',
      })
    }

    const barberDismiss = await Barber.findBy('user_id', params.id)

    if (!barberDismiss || barberDismiss.barber_function === 'owner') {
      return response.unauthorized({
        message: 'O dono não pode ser demitiddo',
      })
    }

    if (barberDismiss.barbershop_id !== barbershop.barbershop_id) {
      return response.unauthorized({
        message: 'Esse funcioanrio não pertence a essa barbearia',
      })
    }

    barberDismiss.merge({
      barbershop_id: null,
    })

    await barberDismiss.save()

    return response.ok({
      message: 'Funcionário removido com sucesso',
    })
  }
}
