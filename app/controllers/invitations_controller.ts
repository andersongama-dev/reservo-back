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

    return response.created({ message: 'Convite criado com sucesso' })
  }

  async bybarbershop({ auth, response }: HttpContext) {
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

    if (barber.barber_function !== 'owner') {
      return response.unauthorized('Você não pode ver convites')
    }

    const barbershop = await Barbershop.find(barber.barbershop_id)

    if (!barbershop) {
      return response.notFound('Babearia não encotrada')
    }

    const invitations = await Invitation.query()
      .where('barbershop_id', barbershop.barbershop_id)
      .where('invitation_by', 'barber')
      .where('invitation_status', true)
      .preload('barber', (query) => {
        query.preload('user')
      })

    return response.ok({
      invitations,
    })
  }

  async bybarber({ auth, response }: HttpContext) {
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

    const invitations = await Invitation.query()
      .where('barber_id', barber.barber_id)
      .where('invitation_by', 'barbershop')
      .where('invitation_status', true)
      .preload('barber', (query) => {
        query.preload('user')
      })

    return response.ok({
      invitations,
    })
  }

  async acceptinvitation({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Não auteticado' })
    }

    const data = request.only(['invitation_id'])

    const invitation = await Invitation.find(data.invitation_id)

    if (!invitation) {
      return response.notFound('Convite não encotrado')
    }

    if (invitation.invitation_status === false) {
      return response.badRequest({
        message: 'Convite já processado',
      })
    }

    const barberAuth = await Barber.findBy('user_id', user.user_id)

    if (!barberAuth) {
      return response.unauthorized({
        message: 'Você não tem relação com o convite',
      })
    }

    if (invitation.invitation_by === 'barbershop') {
      if (barberAuth.barber_id !== invitation.barber_id) {
        return response.unauthorized('Você não pode aceitar este convite')
      }
    }

    if (invitation.invitation_by === 'barber') {
      if (barberAuth.barber_function !== 'owner') {
        return response.unauthorized('Apenas o proprietário pode aceitar')
      }

      if (barberAuth.barbershop_id !== invitation.barbershop_id) {
        return response.unauthorized('Você não pertence a esta barbearia')
      }
    }

    const barber = await Barber.find(invitation.barber_id)

    if (!barber) {
      return response.unauthorized({
        message: 'Você não é um barberio',
      })
    }

    const barbershop = await Barbershop.find(invitation.barbershop_id)

    if (!barbershop) {
      return response.notFound('Barbearia não encotrada')
    }

    invitation.merge({
      invitation_status: false,
    })

    await invitation.save()

    barber.merge({
      barbershop_id: barbershop.barbershop_id,
    })

    await barber.save()

    return response.ok({
      message: 'Convite aceito',
    })
  }

  async rejectintation({ auth, params, response }: HttpContext) {
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

    const invitation = await Invitation.find(params.id)

    if (!invitation) {
      return response.notFound('Convite não encotrado')
    }

    const barberAuth = await Barber.findBy('user_id', user.user_id)

    if (!barberAuth) {
      return response.unauthorized({
        message: 'Você não tem relação com o convite',
      })
    }

    if (invitation.invitation_by === 'barbershop') {
      if (barberAuth.barber_id !== invitation.barber_id) {
        return response.unauthorized('Você não pode aceitar este convite')
      }
    }

    if (invitation.invitation_by === 'barber') {
      if (barberAuth.barber_function !== 'owner') {
        return response.unauthorized('Apenas o proprietário pode aceitar')
      }

      if (barberAuth.barbershop_id !== invitation.barbershop_id) {
        return response.unauthorized('Você não pertence a esta barbearia')
      }
    }

    await invitation.delete()

    return response.ok('Serviço deletado com sucesso')
  }
}
