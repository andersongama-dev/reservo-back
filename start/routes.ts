import UsersController from '#controllers/users_controller'
import User from '#models/user'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  const user = await User.all()

  return {
    user,
  }
})

router.post('/register', [UsersController, 'store'])
router.post('/login', [UsersController, 'login'])
