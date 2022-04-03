import '../styles/globals.css'
import ThemeProvider, { theme } from '../styles/theme'
import { LitteraProvider } from '@assembless/react-littera'
import { SessionProvider } from 'next-auth/react'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	return (
		<SessionProvider session={session}>
			<ThemeProvider theme={theme}>
				<LitteraProvider locales={['en_US', 'uk_UA', 'ru_RU']}>
					<Component {...pageProps} />
				</LitteraProvider>
			</ThemeProvider>
		</SessionProvider>
	)
}

export default MyApp
