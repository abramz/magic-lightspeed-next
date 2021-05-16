import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
} from '@chakra-ui/react'
import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons'

import { Hero } from 'src/components/Hero'
import { Container } from 'src/components/Container'
import { Main } from 'src/components/Main'
import { DarkModeSwitch } from 'src/components/DarkModeSwitch'
import { CTA } from 'src/components/CTA'
import { Footer } from 'src/components/Footer'
import Page from 'src/components/Page'

export default function Index(): React.ReactElement | null {
  return (
    <Page requiresLogin>
      <Container height="100vh">
        <Hero />
        <Main>
          <Text>
            Example repository of <Code>Next.js</Code> + <Code>chakra-ui</Code>{' '}
            + <Code>typescript</Code>.
          </Text>

          <List spacing={3} my={0}>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <ChakraLink
                isExternal
                href="https://chakra-ui.com"
                flexGrow={1}
                mr={2}
              >
                Chakra UI <LinkIcon />
              </ChakraLink>
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <ChakraLink
                isExternal
                href="https://nextjs.org"
                flexGrow={1}
                mr={2}
              >
                Next.js <LinkIcon />
              </ChakraLink>
            </ListItem>
          </List>
        </Main>

        <DarkModeSwitch />
        <Footer>
          <Text>Next ❤️ Chakra</Text>
        </Footer>
        <CTA />
      </Container>
    </Page>
  )
}
