import SessionRsController from '#controllers/session_rs_controller'
import UsersController from '#controllers/users_controller'
import User from '#models/user'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import BarbersController from '#controllers/barbers_controller'
import BarbershopsController from '#controllers/barbershops_controller'
import ServicesController from '#controllers/services_controller'
import InvitationsController from '#controllers/invitations_controller'
import EmployeesController from '#controllers/employees_controller'

router.get('/', async () => {
  const user = await User.all()

  return {
    user,
  }
})

router.post('/register', [UsersController, 'store'])
router.post('/login', [SessionRsController, 'store'])

router
  .group(() => {
    router.get('/me', [UsersController, 'show'])
    router.patch('/edit', [UsersController, 'edit'])
    router.delete('/logout', [SessionRsController, 'destroy'])
    router.patch('/onboarding', [UsersController, 'onboarding'])
    router.post('/barber', [BarbersController, 'store'])
    router.get('/barber/function', [BarbersController, 'myfunction'])
    router.post('/barbershop', [BarbershopsController, 'store'])
    router.get('/barbershop/me', [BarbershopsController, 'show'])
    router.patch('/barbershop/edit', [BarbershopsController, 'edit'])
    router.post('/service', [ServicesController, 'store'])
    router.get('/service/all', [ServicesController, 'listServices'])
    router.patch('/service/update', [ServicesController, 'update'])
    router.patch('/service/disable', [ServicesController, 'disable'])
    router.delete('/service/delete/:id', [ServicesController, 'delete'])
    router.post('/invitation', [InvitationsController, 'store'])
    router.get('/invitation/bybarbershop', [InvitationsController, 'bybarbershop'])
    router.get('/invitation/bybarber', [InvitationsController, 'bybarber'])
    router.patch('/invitation/accept', [InvitationsController, 'acceptinvitation'])
    router.delete('/invitation/:id', [InvitationsController, 'rejectintation'])
    router.get('employee/all', [EmployeesController, 'all'])
    router.delete('employee/dismiss/:id', [EmployeesController, 'dismiss'])
  })
  .use(middleware.auth())
