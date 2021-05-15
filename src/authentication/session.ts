import type { NextApiRequest, NextApiResponse } from 'next'
import Iron from '@hapi/iron'
import {
  MAX_AGE,
  setTokenCookie,
  getTokenCookie,
  removeTokenCookie,
} from './cookies'

const TOKEN_SECRET = process.env.TOKEN_SECRET

export async function setLoginSession(res: NextApiResponse, session) {
  const createdAt = Date.now()
  // Create a session object with a max age that we can validate later
  const obj = { ...session, createdAt, maxAge: MAX_AGE }
  const token = await Iron.seal(obj, TOKEN_SECRET, Iron.defaults)

  setTokenCookie(res, token)
}

export async function getLoginSession(req: NextApiRequest) {
  const token = getTokenCookie(req)

  if (!token) return

  const session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults)
  const expiresAt = session.createdAt + session.maxAge * 1000

  // Validate the expiration date of the session
  if (Date.now() > expiresAt) {
    throw new Error('Session expired')
  }

  return session
}

export async function clearLoginSession(res: NextApiResponse) {
  removeTokenCookie(res)
}
