import { useState, useRef, useCallback, useEffect } from 'react'
// MAP
import DeckGL from '@deck.gl/react'
import ReactMapGl, { Marker } from 'react-map-gl'
import { IconLayer, ScatterplotLayer } from '@deck.gl/layers'
import Papa from 'papaparse'
import { FillStyleExtension } from '@deck.gl/extensions'
// meta
import { useLitteraMethods } from '@assembless/react-littera'
import { Box, Button, Typography } from '@mui/material'
import { extent } from 'd3-array'
import { scaleTime } from '@visx/scale'

import 'mapbox-gl/dist/mapbox-gl.css'
import Stack from '@mui/material/Stack'
import { useSetViewport, useViewport } from '../../contexts/Viewport'

import { MethodModal } from './MethodsModal'
import { MapButtons } from './MapButton'
import { TopPanel } from './TopPanel'
import MapMarkers from './MapMarkers'

const mapStyle = 'mapbox://styles/dhalpern/cl2ih86m6000414lt3r30nf6h'
const MAPBOX_TOKEN =
	'pk.eyJ1IjoiZGhhbHBlcm4iLCJhIjoiY2p3MHFvZHg2MDcyczQ4bXBjNW85aDh2OCJ9.OUluk6vAGe5BVXLOiGIoQQ'


const TextMap = {
	SHELLING: 'B',
	GUNFIRE: 'G',
	SIREN: 'S'
}

const ICON_MAPPING = {
	SIREN: { x: 0, y: 0, width: 128, height: 128, mask: true },
	GUNFIRE: { x: 128, y: 0, width: 128, height: 128, mask: true },
	SHELLING: { x: 256, y: 0, width: 128, height: 128, mask: true }
}
const PATTERN_MAPPING = {
	'hatch-1x': {
		x: 4,
		y: 4,
		width: 120,
		height: 120,
		mask: true
	},
	'hatch-2x': {
		x: 132,
		y: 4,
		width: 120,
		height: 120,
		mask: true
	},
	'hatch-cross': {
		x: 4,
		y: 132,
		width: 120,
		height: 120,
		mask: true
	},
	dots: {
		x: 132,
		y: 132,
		width: 120,
		height: 120,
		mask: true
	}
}

const gray = '#868686'
const red = '#ff0000'

const getDate = (x) => x.time

export function EventMap({ controller = true }) {
	// MODAL
	const [modalOpen, setModalOpen] = useState(false)
	const handleToggleModal = () => setModalOpen((prev) => !prev)

	// EVENT DETECTIONS
	const [data, setData] = useState([])
	const handleLoadData = (data) => {
		setData(data.data.map((f, id) => ({ ...f, id })))
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

	//SOUND DATA
	const [soundData, setSoundData] = useState([])
	const [activePhone, setActivePhone] = useState('')
	const handleLoadSoundData = (data) => {
		setSoundData(data.data.map((f) => ({ ...f, time: new Date(f.time) })))
	}
	useEffect(() => {
		const fetchData = async () => {
			Papa.parse('/data/mockSoundData.csv', {
				header: true,
				download: true,
				dynamicTyping: true,
				complete: handleLoadSoundData
			})
		}
		fetchData()
	}, [])

	// MAP
	const [currentObject, setCurrentObject] = useState({})
	const handleChartClick = (d) => {
		if (d) {
			setCurrentObject(d)
			setViewport((prev) => ({
				...prev,
				latitude: d.y,
				longitude: d.x,
				zoom: 11
			}))
		} else {
			setCurrentObject({})
		}
	}
	const handleMapHover = ({ x, y, object }) => {
		if (object) {
			setCurrentObject({
				...object,
				screenX: x,
				screenY: y
			})
		} else {
			setCurrentObject({})
		}
	}
	const viewport = useViewport()
	const setViewport = useSetViewport()
	const { locale } = useLitteraMethods()

	const dateRange = extent(data, getDate)
	const getDateScale = () => {
		const max = dateRange[1]
		let min = new Date(dateRange[1])
		min.setDate(min.getDate() - 7)

		const scale = scaleTime()
			.domain(['01-01-1970', min, max])
			.range([gray, gray, red])
		return scale
	}
	const dateScale = getDateScale()

	const layers = [
		
		new IconLayer({
			id: 'center',
			data,
			pickable: true,
			getPosition: (d) => [d.x, d.y, 1],
			getText: (d) => TextMap[d.type],
			getSize: 1.5,
			onHover: handleMapHover,
			iconAtlas: '/img/map_icons.png',
			getColor: (d) => {
				if (!currentObject?.id || currentObject.id === d.id) {
					return dateScale(d.time)
						.slice(4, -1)
						.split(',')
						.map((x) => parseInt(x))
				}
				return [60, 60, 60]
			},
			iconMapping: ICON_MAPPING,
			getIcon: (d) => d.type,
			sizeScale: 8,
			updateTriggers: {
				getColor: [currentObject?.id]
			},
			transitions: {
				getColor: 250
			}
		}),
		new ScatterplotLayer({
			id: 'confidence area bg',
			data,
			getPosition: (d) => [d.x, d.y, 0],
			pickable: true,
			opacity: 0.25,
			stroked: true,
			filled: false,
			radiusScale: 1,
			radiusMinPixels: 1,
			radiusMaxPixels: 10000,
			lineWidthMinPixels: 1,
			getRadius: (d) => d.radius,
			getLineColor: (d) => [255, 255, 255],
			onHover: handleMapHover
		}),
		new ScatterplotLayer({
			id: 'confidence area highlight',
			data,
			getPosition: (d) => [d.x, d.y, 1],
			pickable: true,
			opacity: 0.25,
			stroked: true,
			filled: true,
			radiusScale: 1,
			radiusMinPixels: 1,
			radiusMaxPixels: 10000,
			lineWidthMinPixels: 2,
			getRadius: (d) => d.radius,
			onHover: handleMapHover,
			getFillColor: (d) => [
				10,
				0,
				20,
				d.id === currentObject.id ? 255 : 0
			],
			updateTriggers: {
				getFillColor: [currentObject.id]
			}
		}),
		new ScatterplotLayer({
			id: 'confidence area',
			data,
			getPosition: (d) => [d.x, d.y, 2],
			pickable: true,
			opacity: 1,
			stroked: true,
			filled: true,
			radiusScale: 1,
			radiusMinPixels: 1,
			radiusMaxPixels: 10000,
			lineWidthMinPixels: 1,
			getRadius: (d) => d.radius,
			getFillColor: [200, 200, 200, 15],
			getLineColor: [255, 255, 255],
			onHover: handleMapHover
		})
	]

	return (
		<>
			<Stack spacing={0} sx={{ height: '100vh' }}>
				<TopPanel
					iconMapping={ICON_MAPPING}
					{...{
						activePhone,
						setActivePhone,
						handleChartClick,
						data,
						soundData
					}}
				/>
				<Box
					flexGrow={1}
					sx={{ position: 'relative', minHeight: 400, width: '100%' }}
				>
					<DeckGL
						viewState={viewport}
						onViewStateChange={({ viewState: newViewState }) =>
							setViewport(newViewState)
						}
						intertia={0}
						controller={{
							intertia: true
						}}
						layers={layers}
						pickingRadius={20}
					>
						<ReactMapGl
							locale={locale}
							mapboxAccessToken={MAPBOX_TOKEN}
							reuseMaps
							mapStyle={mapStyle}
							preventStyleDiffing={true}
						>
							<MapMarkers 
								data={data}
								currentObjectId={currentObject?.id}
								zoom={Math.round(viewport.zoom/10)*10}
								/>
						</ReactMapGl>
					</DeckGL>
					<MapButtons setViewport={setViewport} />
				</Box>
			</Stack>
			<Button
				variant="text"
				onClick={handleToggleModal}
				sx={{
					margin: 0,
					padding: '0 10px',
					background: 'white',
					color: 'black',
					borderRadius: '0',
					marginLeft: '5px',
					position: 'absolute',
					right: 0,
					top: '50%',
					transform: 'translate(40%, -50%) rotate(90deg)'
				}}
			>
				Methods &amp; About
			</Button>
			<MethodModal open={modalOpen} handleClose={handleToggleModal} />
		</>
	)
}
