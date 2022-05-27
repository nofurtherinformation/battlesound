import { useState, useEffect } from 'react'
// MAP
// import useSound from 'use-sound';
import DeckGL from '@deck.gl/react'
import ReactMapGl, { Marker } from 'react-map-gl'
import { IconLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers'
import Papa from 'papaparse'
// meta
import { useLitteraMethods } from '@assembless/react-littera'
import { Box, Button } from '@mui/material'
import { extent } from 'd3-array'
import { scaleTime } from '@visx/scale'

import 'mapbox-gl/dist/mapbox-gl.css'
import Stack from '@mui/material/Stack'
import { useSetViewport, useViewport } from '../../contexts/Viewport'

import { MethodModal } from './MethodsModal'
import { MapButtons } from './MapButton'
import { TopPanel } from './TopPanel'
import MapMarkers from './MapMarkers'
import { AudioPlayer } from './AudioPlayer'

const mapStyle = 'mapbox://styles/dhalpern/cl2ih86m6000414lt3r30nf6h'
const MAPBOX_TOKEN =
	'pk.eyJ1IjoiZGhhbHBlcm4iLCJhIjoiY2p3MHFvZHg2MDcyczQ4bXBjNW85aDh2OCJ9.OUluk6vAGe5BVXLOiGIoQQ'
const defaultPlaceholder = "/audio/placeholder.wav"

const TextMap = {
	SHELLING: 'B',
	GUNFIRE: 'G',
	SIREN: 'S'
}

const ICON_MAPPING = {
	EXPLOSION: { x: 512, y: 0, width: 128, height: 128, mask: true },
	SIREN:{ x: 384, y: 0, width: 128, height: 128, mask: true },
	BIRD:{ x: 256, y: 0, width: 128, height: 128, mask: true },
	DOG:{ x: 128, y: 0, width: 128, height: 128, mask: true },
	TRAFFIC:{ x: 0, y: 0, width: 128, height: 128, mask: true }
}
const ICON_MAPPING2 = {
	PHONE: { x:0, y:0, width:128, height:128, mask: true}
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

const old = '#42a7ff'
const recent = '#ffd506'

const getDate = (x) => x.time

export function EventMap({ controller = true }) {
	// MODAL
	const [modalOpen, setModalOpen] = useState(false)
	const handleToggleModal = () => setModalOpen((prev) => !prev)

	// EVENT DETECTIONS
	const [data, setData] = useState([])
	const [phoneData, setPhoneData] = useState([])
	
	const handleLoadData = (data) => {
		setData(data.data.map((f, id) => ({ ...f, id })))
	}
	const handleLoadPhoneData = (data) => {
		setPhoneData(data.data)
	}
	useEffect(() => {
		const fetchData = async () => {
			Papa.parse('/data/mockData.csv', {
				header: true,
				download: true,
				dynamicTyping: true,
				complete: handleLoadData
			})
			Papa.parse('/data/mockPhoneLocations.csv', {
				header: true,
				download: true,
				dynamicTyping: true,
				complete: handleLoadPhoneData
			})
		}
		fetchData()
	}, [])
	// SOUNDS
	const [muted, setMuted] = useState(false)

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
    const track = currentObject?.file || defaultPlaceholder
    // const [play, { stop }] = useSound(track);
	const play = () => {}
	const stop = () => {}
	useEffect(() => {
		if (currentObject && !muted) {
			stop()
		}
	},[currentObject.id, track]) //eslint-disable-line react-hooks/exhaustive-deps
	
	const handleChartClick = (d) => {
		if (d) {
			setCurrentObject(d)
			setViewport((prev) => ({
				...prev,
				latitude: d.y,
				longitude: d.x,
				zoom: 11
			}))
			// play()
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
	
	const handleMapClick = () => {
		play()
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
			.range([old, old, recent])
		return scale
	}
	const dateScale = getDateScale()
	const layers = [
		
		new IconLayer({
			id: 'phone locations',
			data: phoneData,
			pickable: true,
			getPosition: (d) => [d.x, d.y, 10],
			getSize: 1.5,
			iconAtlas: '/img/PHONE_ICON.png',
			getColor: [255,255,255],
			iconMapping: ICON_MAPPING2,
			getIcon: d=>'PHONE',
			sizeScale: 16
		}),
		new TextLayer({
			id: 'phone locations label',
			data: phoneData,
			pickable: true,
			getPosition: (d) => [d.x, d.y, 10],
			getSize: 1.5,
			sizeScale: 16,
			getText: d => d.id,
			getColor: [255,255,255],
			getPixelOffset: 50
			
		}),
		new IconLayer({
			id: 'center',
			data,
			pickable: true,
			getPosition: (d) => [d.x, d.y, 1],
			getText: (d) => TextMap[d.type],
			getSize: 1.5,
			onHover: handleMapHover,
			onClick: handleMapClick,
			iconAtlas: '/img/ICONS.png',
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
			onHover: handleMapHover,
			onClick: handleMapClick,
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
			onClick: handleMapClick,
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
			onHover: handleMapHover,
			onClick: handleMapClick,
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
						soundData,
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
			<AudioPlayer currentObject={currentObject} muted={muted} />
		</>
	)
}
