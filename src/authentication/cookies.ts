import { serialize, parse } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'

const TOKEN_NAME = 'token'

export const MAX_AGE = 60 * 60 * 24 * 14 // 14 days

/**
 * Set the token cookie in the response
 *
 * @param res response object
 * @param token secure cookie to set
 */
export function setTokenCookie(res: NextApiResponse, token: string): void {
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  })

  res.setHeader('Set-Cookie', cookie)
}

/**
 * Remove the token cookie in the response
 *
 * @param res response object
 */
export function removeTokenCookie(res: NextApiResponse): void {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
}

/**
 * Parse the request cookies
 *
 * @param req request object
 * @returns parsed cookies
 */
export function parseCookies(req: NextApiRequest): { [key: string]: string } {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie
  return parse(cookie || '')
}

/**
 * Get the token cookie from the request
 *
 * @param req request object
 * @returns the token cookie
 */
export function getTokenCookie(req: NextApiRequest): string {
  const cookies = parseCookies(req)
  return cookies[TOKEN_NAME]
}
