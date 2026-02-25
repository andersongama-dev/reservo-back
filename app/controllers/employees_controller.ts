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

    const barber = await Barber.find(user.user_id)

    if (!barber || barber.barber_function !== 'owner') {
      return response.unauthorized({
        message: 'Voĉe não possui ter funcionarios',
      })
    }

    const barbershop = await Barbershop.find(barber.barbershop_id)

    if (!barbershop) {
      return response.notFound({
        message: 'Barbearia não encotrada',
      })
    }

    const employees = await Barber.query().where('barbershop_id', barbershop.barbershop_id)

    return response.ok({
      employees,
    })
  }
}
