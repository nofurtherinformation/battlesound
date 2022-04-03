import '../styles/globals.css'
import ThemeProvider, { theme } from '../styles/theme'
import { LitteraProvider } from "@assembless/react-littera";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <LitteraProvider locales={[ "en_US", "uk_UA", "ru_RU" ]}>
        <Component {...pageProps} />
      </LitteraProvider>
    </ThemeProvider>
  )
  
}

export default MyApp
