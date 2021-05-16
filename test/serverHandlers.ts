import { rest } from 'msw'
import { ALLOWED_EMAIL, ISSUER } from './testData'

const handlers = [
  rest.get('/api/checkEmail', async (_req, res, ctx) => res(ctx.status(201))),
  rest.get('/api/login', async (_req, res, ctx) => res(ctx.status(201))),
  rest.get('/api/user', async (_req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({ user: { email: ALLOWED_EMAIL, issuer: ISSUER } })
    )
  ),
]

export { handlers }
