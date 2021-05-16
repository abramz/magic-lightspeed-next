import type { NextApiRequest, NextApiResponse } from 'next'
import { getLoginSession } from 'src/authentication/session'
import logout from './logout'

const EMAIL_ALLOWLIST = (process.env.EMAIL_ALLOWLIST || '').split(',')

/**
 * Get the user metadata, mostly to check if they are logged in or not
 *
 * @param req request object
 * @param res response object
 */
export default async function user(req: NextApiRequest, res: NextApiResponse) {
  const session = await getLoginSession(req)

  if (session) {
    const { email, issuer } = session
    if (EMAIL_ALLOWLIST.includes(email)) {
      res.status(200).json({ user: { email, issuer } })

      return
    } else {
      // invalidate a session if the email has been removed from the allow list
      return logout(req, res)
    }
  }

  res.status(200).json({ user: null })
}
