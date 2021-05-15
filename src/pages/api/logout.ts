import type { NextApiRequest, NextApiResponse } from 'next'
import { magic } from '../../authentication/magic'
import {
  getLoginSession,
  clearLoginSession,
} from '../../authentication/session'

/**
 * Log out w/ Magic & remove the session cookie
 *
 * @param req request object
 * @param res response object
 */
export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getLoginSession(req)

    if (session) {
      await magic.users.logoutByIssuer(session.issuer)

      clearLoginSession(res)
    }
  } catch (error) {
    console.error(error)
  }

  res.writeHead(302, { Location: '/login' })
  res.end()
}
