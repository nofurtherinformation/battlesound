import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Typography } from '@mui/material'
import Nav from '../components/Nav'
import dynamic from 'next/dynamic'
import { ScatterplotLayer } from '@deck.gl/layers'
import Papa from 'papaparse'

const Map = dynamic(() => import('../components/Map'), {
	ssr: false
})

const INITIAL_VIEW_STATE = {
	longitude: 30.54414,
	latitude: 50.439188,
	zoom: 10,
	maxZoom: 22,
	pitch: 0,
	bearing: 0
}

export default function MapPage() {
	const [data, setData] = useState([])
	useEffect(() => {
		const fetchData = async () => {
			const data = await fetch('/data/mockData.csv').then(r => r.text())
			console.log(data)
		}
		fetchData()
	},[])
	const layers = [
		new ScatterplotLayer({
			id: '',
			data
		})
	]
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
				<Typography variant="h2" color="primary" fontWeight={'bold'}>
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
				<Map INITIAL_VIEW_STATE={INITIAL_VIEW_STATE} layers={layers} />
			</div>
		</div>
	)
}
