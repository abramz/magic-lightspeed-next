import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '../../../test/testUtils'
import { TEST_EMAIL } from '../../../test/testData'
import { magic } from '../../magic'
import Login from '../login'
import Router from 'next/router'
import { server, rest } from '../../../test/server'

jest.mock('../../magic')
jest.mock('next/router', () => ({ push: jest.fn() }))

describe('<Login />', () => {
  it('should log the user in and go to the index page', async () => {
    ;(magic.auth.loginWithMagicLink as jest.Mock).mockReturnValue('boop')

    render(<Login />)

    const input = screen.getByPlaceholderText('Enter your email address')
    const button = screen.getByRole('button')

    // user enters the email
    userEvent.type(input, TEST_EMAIL)
    expect(input).toHaveValue(TEST_EMAIL)

    // user submits
    userEvent.click(button)

    // expect the submit button to be disabled
    expect(await screen.findByRole('button')).toBeDisabled()

    // expect loginWithMagicLink to have been called
    await waitFor(() =>
      expect(magic.auth.loginWithMagicLink).toHaveBeenCalledWith({
        email: TEST_EMAIL,
        redirectURI: 'http://localhost/callback',
      })
    )

    // expect to be navigate to the index page
    await waitFor(() => expect(Router.push).toHaveBeenCalledWith('/'))
  })

  it('should do nothing if the email is not provided', async () => {
    render(<Login />)

    // user submits
    userEvent.click(screen.getByRole('button'))

    // expect the submit button to remain enabled
    expect(await screen.findByRole('button')).not.toBeDisabled()

    // expect none of the login actions happen
    await waitFor(() =>
      expect(magic.auth.loginWithMagicLink).not.toHaveBeenCalled()
    )
    await waitFor(() => expect(Router.push).not.toHaveBeenCalled())
  })

  it('should not log in if the email is not allowed', async () => {
    server.use(
      rest.get('/api/checkEmail', (_req, res, ctx) => res(ctx.status(404)))
    )

    render(<Login />)

    const input = screen.getByPlaceholderText('Enter your email address')

    // user enters the email
    userEvent.type(input, TEST_EMAIL)
    expect(input).toHaveValue(TEST_EMAIL)

    // user submits
    userEvent.click(screen.getByRole('button'))

    // expect the submit button to be disabled
    expect(await screen.findByRole('button')).toBeDisabled()

    // expect none of the login actions happen
    await waitFor(() =>
      expect(magic.auth.loginWithMagicLink).not.toHaveBeenCalled()
    )
    await waitFor(() => expect(Router.push).not.toHaveBeenCalled())

    // expect the submit button to become enabled
    expect(await screen.findByRole('button')).not.toBeDisabled()
  })

  it('should not go to the index page if the login fails', async () => {
    server.use(rest.get('/api/login', (_req, res, ctx) => res(ctx.status(500))))
    render(<Login />)
    const input = screen.getByPlaceholderText('Enter your email address')

    // user enters the email
    userEvent.type(input, TEST_EMAIL)
    expect(input).toHaveValue(TEST_EMAIL)

    // user submits
    userEvent.click(screen.getByRole('button'))

    // expect the submit button to be disabled
    expect(await screen.findByRole('button')).toBeDisabled()

    // expect none of the login actions happen
    await waitFor(() =>
      expect(magic.auth.loginWithMagicLink).toHaveBeenCalled()
    )
    await waitFor(() => expect(Router.push).not.toHaveBeenCalled())

    // expect the submit button to become enabled
    expect(await screen.findByRole('button')).not.toBeDisabled()
  })
})
