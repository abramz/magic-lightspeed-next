import React from 'react'
import Router from 'next/router'
import { magic } from 'src/utils/magic'
import { server, rest } from 'test/server'
import { render, waitFor } from 'test/testUtils'
import { DID_TOKEN } from 'test/testData'
import Callback from 'src/pages/callback'

jest.mock('src/utils/magic')
jest.mock('next/router', () => ({ push: jest.fn() }))

describe('<Callback />', () => {
  it('should try to log in the user and go to the index page', async () => {
    ;(magic.auth.loginWithCredential as jest.Mock).mockResolvedValue(DID_TOKEN)

    render(<Callback />)

    // expect loginWithCredential to have been called
    await waitFor(() =>
      expect(magic.auth.loginWithCredential).toHaveBeenCalled()
    )

    // expect to be navigate to the index page
    await waitFor(() => expect(Router.push).toHaveBeenCalledWith('/'))
  })

  it("should go to the login page the user can't log in", async () => {
    ;(magic.auth.loginWithCredential as jest.Mock).mockResolvedValue(DID_TOKEN)

    server.use(rest.get('/api/login', (_req, res, ctx) => res(ctx.status(500))))

    render(<Callback />)

    // expect loginWithCredential to have been called
    await waitFor(() =>
      expect(magic.auth.loginWithCredential).toHaveBeenCalled()
    )

    // expect to be navigate to the login page
    await waitFor(() => expect(Router.push).toHaveBeenCalledWith('/login'))
  })

  it('should go to the login page if there is a problem logging in', async () => {
    ;(magic.auth.loginWithCredential as jest.Mock).mockRejectedValue(DID_TOKEN)

    render(<Callback />)

    // expect loginWithCredential to have been called
    await waitFor(() =>
      expect(magic.auth.loginWithCredential).toHaveBeenCalled()
    )

    // expect to be navigate to the login page
    await waitFor(() => expect(Router.push).toHaveBeenCalledWith('/login'))
  })
})
