import SessionRsController from '#controllers/session_rs_controller'
import UsersController from '#controllers/users_controller'
import User from '#models/user'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import BarbersController from '#controllers/barbers_controller'
import BarbershopsController from '#controllers/barbershops_controller'
import ServicesController from '#controllers/services_controller'

router.get('/', async () => {
  const user = await User.all()

  return {
    user,
  }
})

router.post('/register', [UsersController, 'store'])
router.post('/login', [SessionRsController, 'store'])
router.delete('/logout', [SessionRsController, 'destroy']).use(middleware.auth())

router
  .group(() => {
    router.get('/me', [UsersController, 'show'])
    router.patch('/edit', [UsersController, 'edit'])
    router.post('/barber', [BarbersController, 'store'])
    router.post('/barbershop', [BarbershopsController, 'store'])
    router.post('/service', [ServicesController, 'store'])
    router.get('/service/all', [ServicesController, 'listServices'])
  })
  .use(middleware.auth())
