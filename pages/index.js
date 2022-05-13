import Head from 'next/head'
import { Box, Icon, Typography } from '@mui/material'
import Nav from '../components/Nav'
import dynamic from 'next/dynamic'
import EventMap from '../components/EventMap'
import { ViewportProvider } from '../contexts/Viewport'

const INITIAL_VIEW_STATE = {
	longitude: 30.54414,
	latitude: 50.439188,
	zoom: 10,
	maxZoom: 22,
	pitch: 0,
	bearing: 0
}

export default function MapPage() {
	return (
		<Box
			sx={{
				width: '100%',
				height: '100%',
				overflow: 'hidden',
				position: 'absolute'
			}}
		>
			<Head>
				<title>Map :: BattleSound</title>
				<meta
					name="description"
					content="How can sound protect Ukraine's people from attack?"
				/>
			</Head>
			{/* <Nav page="Map" /> */}
			<div
				style={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					top: 0,
					left: 0
				}}
			>
				<ViewportProvider defaultViewport={INITIAL_VIEW_STATE}>
					<EventMap />
				</ViewportProvider>
			</div>
		</Box>
	)
}
