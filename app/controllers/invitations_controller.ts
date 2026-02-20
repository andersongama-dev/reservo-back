import type { HttpContext } from '@adonisjs/core/http'
import Barbershop from '#models/barbershop'
import Barber from '#models/barber'
import Invitation from '#models/invitation'

export default class InvitationsController {
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Não auteticado' })
    }

    const barber = await Barber.findBy('user_id', user.user_id)

    if (!barber) {
      return response.unauthorized({
        message: 'Você não é um barberio',
      })
    }

    if (barber.barber_function == 'professional') {
      return response.unauthorized('Você não pode criar convites')
    }

    const data = request.only(['invitation_code', 'invitation_by'])

    if (data.invitation_by == 'barber') {
      const barbershop = await Barbershop.findBy('invitation_code', data.invitation_code)

      if (!barbershop) {
        return response.notFound('Código de convite invalido')
      }

      await Invitation.create({
        invitation_by: data.invitation_by,
        barbershop_id: barbershop.barbershop_id,
        barber_id: barber.barber_id,
      })
    }

    if (data.invitation_by == 'barbershop') {
      const barberByCode = await Barber.findBy('invitation_code', data.invitation_code)

      if (!barberByCode) {
        return response.notFound('Código de convite invalido')
      }

      const barbershop = await Barbershop.findBy('barbershop_id', barber.barbershop_id)

      if (!barbershop) {
        return response.notFound('Barbearia não encotrada')
      }

      await Invitation.create({
        invitation_by: data.invitation_by,
        barbershop_id: barbershop.barbershop_id,
        barber_id: barberByCode.barber_id,
      })
    }
  }
}
