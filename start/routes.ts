import SessionRsController from '#controllers/session_rs_controller'
import UsersController from '#controllers/users_controller'
import User from '#models/user'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

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
  })
  .use(middleware.auth())
