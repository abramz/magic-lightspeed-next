import { render, RenderResult } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { UserProvider } from '../src/hooks/userContext'
import '@testing-library/jest-dom'

const Providers = ({ children }) => {
  return (
    <ChakraProvider>
      <UserProvider>{children}</UserProvider>
    </ChakraProvider>
  )
}

const customRender = (
  ui: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
  options = {}
): RenderResult => render(ui, { wrapper: Providers, ...options })

export * from '@testing-library/react'

export { customRender as render }
