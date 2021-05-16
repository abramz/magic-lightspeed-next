import { ChakraProvider } from '@chakra-ui/react'

import { AppProps } from 'next/app'
import theme from 'src/utils/theme'
import { UserProvider } from 'src/hooks/userContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ChakraProvider>
  )
}

export default MyApp
