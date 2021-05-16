import type { NextApiRequest, NextApiResponse } from 'next'
import { magic } from '../../authentication/magic'
import { setLoginSession } from '../../authentication/session'

/**
 * Log in w/ Magic & set the session cookie
 *
 * @param req request object
 * @param res response object
 */
export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const didToken = req.headers.authorization.substr(7)
    await magic.token.validate(didToken)
    const metadata = await magic.users.getMetadataByToken(didToken)
    const session = { ...metadata }

    await setLoginSession(res, session)

    res.status(201).end()
  } catch (error) {
    console.error(error)

    res.status(error.status || 500).end()
  }
}
