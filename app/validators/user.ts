import vine from '@vinejs/vine'

export const registerUserValidator = vine.compile(
  vine.object({
    user_name: vine.string().minLength(3).maxLength(100),

    user_email: vine
      .string()
      .email()
      .normalizeEmail()
      .trim()
      .unique({ table: 'users', column: 'user_email' }),

    user_password: vine.string().minLength(6).trim(),
  })
)

export const loginUserValidator = vine.compile(
  vine.object({
    user_email: vine.string().email().normalizeEmail().trim(),

    user_password: vine.string().trim(),
  })
)
