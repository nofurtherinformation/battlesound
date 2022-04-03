import Head from 'next/head'
import { Typography } from '@mui/material'
import Nav from '../components/Nav'

export default function AboutPage() {
	return (
		<div>
			<Head>
				<title>About :: BattleSound</title>
				<meta
					name="description"
					content="How can sound protect Ukraine's people from attack?"
				/>
				<link rel="icon" href="/favicon.ico" />
				<link
					href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400;700&display=swap"
					rel="stylesheet"
				/>
			</Head>
			<Nav page="About" />
			<Typography variant="h1" color="primary">
				About
			</Typography>
		</div>
	)
}
