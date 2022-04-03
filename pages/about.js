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
			</Head>
			<Nav page="About" />
			<Typography variant="h1" color="primary">
				About
			</Typography>
		</div>
	)
}
