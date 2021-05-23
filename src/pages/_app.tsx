import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { UserProvider } from 'src/hooks/userContext'
import theme from 'src/utils/theme'

const MyApp: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <ChakraProvider resetCSS theme={theme}>
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  </ChakraProvider>
)

export default MyApp
