import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Icon, Typography } from '@mui/material'
import Nav from '../components/Nav'
import dynamic from 'next/dynamic'
import { IconLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers'
import Papa from 'papaparse'
import {DataFilterExtension, FillStyleExtension} from '@deck.gl/extensions';

const Map = dynamic(() => import('../components/Map'), {
	ssr: false
})

const ICON_MAPPING = {
	SIREN: { x: 0, y: 0, width: 128, height: 128, mask: true },
	GUNFIRE: { x: 128, y: 0, width: 128, height: 128, mask: true },
	SHELLING: { x: 256, y: 0, width: 128, height: 128, mask: true }
}
const PATTERN_MAPPING = {
	"hatch-1x": {
	  "x": 4,
	  "y": 4,
	  "width": 120,
	  "height": 120,
	  "mask": true
	},
	"hatch-2x": {
	  "x": 132,
	  "y": 4,
	  "width": 120,
	  "height": 120,
	  "mask": true
	},
	"hatch-cross": {
	  "x": 4,
	  "y": 132,
	  "width": 120,
	  "height": 120,
	  "mask": true
	},
	"dots": {
	  "x": 132,
	  "y": 132,
	  "width": 120,
	  "height": 120,
	  "mask": true
	}
  }

const INITIAL_VIEW_STATE = {
	longitude: 30.54414,
	latitude: 50.439188,
	zoom: 10,
	maxZoom: 22,
	pitch: 0,
	bearing: 0
}
const TextMap = {
	SHELLING: 'B',
	GUNFIRE: 'G',
	SIREN: 'S'
}
export default function MapPage() {
	const [data, setData] = useState([])
	const [currId, setCurrId] = useState(-1)
	const handleLoadData = (data) => {
		setData(data.data.map((f, id) => ({ ...f, id })))
	}
	
	const handleMapHover = ({object}) => {
		if (object) {
			const {x, y, id} = object
			setCurrId(id)
		} else {
			setCurrId(-1)
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			Papa.parse('/data/mockData.csv', {
				header: true,
				download: true,
				dynamicTyping: true,
				complete: handleLoadData
			})
		}
		fetchData()
	}, [])


	const layers = [
		new ScatterplotLayer({
			id: 'confidence area',
			data,
			getPosition: d => [d.x, d.y],
			pickable: true,
			opacity: 0.25,
			stroked: true,
			filled: true,
			radiusScale: 1,
			radiusMinPixels: 1,
			radiusMaxPixels: 10000,
			lineWidthMinPixels: 1,
			getRadius: d => d.radius,
			getFillColor: d => [200, 200, 200],
			getLineColor: d => [255,255,255],
			getFilterValue: d => d.id === currId ? 1 : 0,
			filterRange: [1,1],
			updateTriggers: {
				getFilterValue: [currId]
			},
			fillPatternAtlas: './img/patternAtlas.png',
			fillPatternMapping: PATTERN_MAPPING,
			getFillPattern: f => 'hatch-1x',
			getFillPatternScale: 1,
			getFillPatternOffset: [0, 0],
			extensions: [new DataFilterExtension(),new FillStyleExtension({pattern: true})],
		}),
		new ScatterplotLayer({
			id: 'confidence area',
			data,
			getPosition: d => [d.x, d.y],
			pickable: true,
			opacity: 0.25,
			stroked: true,
			filled: false,
			radiusScale: 1,
			radiusMinPixels: 1,
			radiusMaxPixels: 10000,
			lineWidthMinPixels: 1,
			getRadius: d => d.radius,
			getLineColor: d => [255,255,255],
			getFilterValue: d => d.id === currId ? 1 : 0,
			filterRange: [1,1],
			updateTriggers: {
				getFilterValue: [currId]
			},
			extensions: [new DataFilterExtension()],
		}),
		// new ScatterplotLayer({
		// 	id: 'TEXT BG area',
		// 	data,
		// 	getPosition: d => [d.x, d.y],
		// 	pickable: true,
		// 	opacity: .8,
		// 	stroked: true,
		// 	filled: true,
		// 	radiusScale: 1,
		// 	radiusMinPixels: 8,
		// 	radiusMaxPixels: 100,
		// 	getFillColor: d => [247, 218, 101],
		// 	getLineColor: d => [0, 0, 0]
		// }),
		new IconLayer({
			id: 'center',
			data,
			pickable: true,
			getPosition: (d) => [d.x, d.y],
			getText: (d) => TextMap[d.type],
			getSize: 1.5,
			onHover: handleMapHover,
			iconAtlas: '/img/map_icons.png',
			getColor: (d) => [255, 60, 60],
			iconMapping: ICON_MAPPING,
			getIcon: (d) => d.type,
			sizeScale: 8
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
			{/* <Nav page="Map" /> */}
			<div style={{ position: 'absolute', left: 0, top: 0, zIndex: 1 }}>
				<Typography variant="h5" color="primary">
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
