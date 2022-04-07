import Head from 'next/head'
import { Typography } from '@mui/material'
import Nav from '../components/Nav'
import { useSession, signIn, signOut } from "next-auth/react"

function LoginComponent() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} !!!<br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

export default function AboutPage() {
	return (
		<div>
			<Head>
				<title>About :: BattleSound</title>
				<meta
					name="description"
					content="How can sound protect Ukraine's people from attack?"
				/>
			</Head>
			<Nav page="Login" />
			<Typography variant="h1" color="primary">
				Login
			</Typography>
      <LoginComponent />
		</div>
	)
}
