import type { NextApiRequest, NextApiResponse } from 'next'

const EMAIL_ALLOWLIST = (process.env.EMAIL_ALLOWLIST || '').split(',')

/**
 * Check the email against an allow list, both to prevent just anyone from watching the stream & preventing the number of users in magic to explode
 *
 * @param req request object
 * @param res response object
 */
export default async function checkEmail(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { email } = req.query

  if (typeof email === 'string' && EMAIL_ALLOWLIST.includes(email)) {
    res.status(201).end()
  }

  res.status(404).end()
}
