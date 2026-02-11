import vine from '@vinejs/vine'

export const createSessionValidator = vine.compile(
  vine.object({
    user_email: vine.string().email().normalizeEmail().trim(),

    user_password: vine.string().trim(),
  })
)
