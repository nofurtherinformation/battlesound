import Head from 'next/head'
import { Typography } from '@mui/material'
import Nav from '../components/Nav'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('../components/Map'), {
	ssr: false
})

export default function MapPage() {
	return (
		<div>
			<Head>
				<title>Map :: BattleSound</title>
				<meta
					name="description"
					content="How can sound protect Ukraine's people from attack?"
				/>
			</Head>
			<Nav page="Map" />
			<div style={{ position: 'absolute', left: 0, top: 0, zIndex: 1 }}>
				<Typography variant="h2" color="primary" fontWeight={"bold"}>
					BattleSound
				</Typography>
			</div>
			<div
				style={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					top: 0,
					left: 0
				}}
			>
				<Map />
			</div>
		</div>
	)
}
