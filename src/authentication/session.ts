import type { NextApiRequest, NextApiResponse } from 'next'
import Iron from '@hapi/iron'
import {
  MAX_AGE,
  setTokenCookie,
  getTokenCookie,
  removeTokenCookie,
} from './cookies'

export type Session = {
  issuer: string
  publicAddress: string
  email: string
  createdAt: number
  maxAge: number
}

export type CreateSession = Pick<Session, 'issuer' | 'publicAddress' | 'email'>

const TOKEN_SECRET = process.env.TOKEN_SECRET

/**
 * Convenience method to create a session for the user
 *
 * @param res response object
 * @param session session object
 */
export async function setLoginSession(
  res: NextApiResponse,
  session: CreateSession
): Promise<void> {
  const createdAt = Date.now()
  const obj: Session = { ...session, createdAt, maxAge: MAX_AGE }
  const token = await Iron.seal(obj, TOKEN_SECRET, Iron.defaults)

  setTokenCookie(res, token)
}

/**
 * Convenience method to get the user's session if it exists & has not expired
 *
 * @param req request object
 * @returns user's session
 * @throws an error when the session has expired
 */
export async function getLoginSession(req: NextApiRequest): Promise<Session> {
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

/**
 * Convenience method to clear the session cookie
 *
 * @param res response object
 */
export async function clearLoginSession(res: NextApiResponse): Promise<void> {
  removeTokenCookie(res)
}
