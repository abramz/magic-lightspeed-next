import type { NextApiRequest, NextApiResponse } from 'next'
import { getLoginSession } from '../../authentication/session'

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

    // invalidate a session if the email has been removed from the allow list
    if (EMAIL_ALLOWLIST.includes(email)) {
      res.status(200).json({ user: { email, issuer } })

      return
    }
  }

  res.status(200).json({ user: null })
}
