import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
// MAP
import DeckGL from '@deck.gl/react'
import ReactMapGl from 'react-map-gl'
import { MapboxLayer } from '@deck.gl/mapbox'
import { IconLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers'
import Papa from 'papaparse'
import { DataFilterExtension, FillStyleExtension } from '@deck.gl/extensions'
// meta
import { useLitteraMethods } from '@assembless/react-littera'
import { Box, Button, Grid, Icon, Modal, Typography } from '@mui/material'
import { max, extent } from 'd3-array'
import { scaleTime, scaleLinear } from '@visx/scale'

import 'mapbox-gl/dist/mapbox-gl.css'
import { Axis } from '@visx/axis'
import Image from 'next/image'
import { ParentSize } from '@visx/responsive'
import { Text } from '@visx/text'
import Link from 'next/link'
const mapStyle = 'mapbox://styles/dhalpern/cl2ih86m6000414lt3r30nf6h'
const MAPBOX_TOKEN =
	'pk.eyJ1IjoiZGhhbHBlcm4iLCJhIjoiY2p3MHFvZHg2MDcyczQ4bXBjNW85aDh2OCJ9.OUluk6vAGe5BVXLOiGIoQQ'

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

export default function EventMap({
	controller = true,
	viewState = {
		longitude: 30.51414,
		latitude: 50.439188,
		zoom: 12.5,
		maxZoom: 22,
		pitch: 0
	}
}) {
	const [data, setData] = useState([])
	const [currentObject, setCurrentObject] = useState({})
	const [modalOpen, setModalOpen] = useState(false)
	const handleToggleModal = () => setModalOpen((prev) => !prev)
	const handleLoadData = (data) => {
		setData(data.data.map((f, id) => ({ ...f, id })))
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
	const [glContext, setGLContext] = useState()
	const { locale } = useLitteraMethods()
	const mapRef = useRef()
	const deckRef = useRef()

	const layers = [
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
			opacity: 0.25,
			stroked: true,
			filled: true,
			radiusScale: 1,
			radiusMinPixels: 1,
			radiusMaxPixels: 10000,
			lineWidthMinPixels: 1,
			getRadius: (d) => d.radius,
			getFillColor: (d) => [200, 200, 200],
			getLineColor: (d) => [255, 255, 255],
			onHover: handleMapHover,
			fillPatternAtlas: './img/patternAtlas.png',
			fillPatternMapping: PATTERN_MAPPING,
			getFillPattern: (f) => 'hatch-1x',
			getFillPatternScale: 1,
			getFillPatternOffset: [0, 0],
			extensions: [new FillStyleExtension({ pattern: true })]
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
			getPosition: (d) => [d.x, d.y, 1],
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

	const onMapLoad = useCallback(() => {
		if (mapRef.current === undefined) return
		const map = mapRef.current.getMap()
		const deck = deckRef.current.deck
		layers.forEach(({ id }) => {
			map.addLayer(new MapboxLayer({ id, deck }), 'road-label-simple')
		})
	}, []) //eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<DeckGL
				initialViewState={INITIAL_VIEW_STATE}
				controller={controller}
				layers={layers}
				pickingRadius={20}
				// ref={deckRef}
				// onWebGLInitialized={setGLContext}
			>
				<ReactMapGl
					locale={locale}
					mapboxAccessToken={MAPBOX_TOKEN}
					reuseMaps
					mapStyle={mapStyle}
					preventStyleDiffing={true}
					// ref={mapRef}
					// gl={glContext}
					// onLoad={() => {
					// 	onMapLoad()
					// }}
				></ReactMapGl>
			</DeckGL>

			{currentObject?.id !== undefined && (
				<Box
					sx={{
						position: 'absolute',
						background: '#192432',
						padding: '1em',
						border: '2px solid white',
						left: currentObject.screenX,
						top: currentObject.screenY,
						zIndex: 5000,
						pointerEvents: 'none'
					}}
				>
					<Typography sx={{ lineHeight: 1 }} color="primary">
						<b>Detected Event:</b>{' '}
						{currentObject.type.toLowerCase()}
						<br />
						<b>Timestamp:</b>{' '}
						{currentObject.time.toLocaleDateString()}
						<br />
						<b>Confidence Radius:</b>{' '}
						{Math.round(currentObject.radius)}m <br />
						<b>Estimated Location:</b>
						<br />
						{Math.round(currentObject.x * 100000) / 100000},
						{Math.round(currentObject.y * 100000) / 100000}
					</Typography>
				</Box>
			)}
			<Box
				sx={{
					position: 'absolute',
					left: '50%',
					top: 0,
					transform: 'translateX(-50%)',
					width: 'clamp(25vw, 1200px, 100vw)',
					background: '#192432',
					padding: '1em',
					color: 'white',
					border: '2px solid white',
					borderTop: 'none'
				}}
			>
				<Grid container spacing={1}>
					<Grid item xs={6} md={2} sx={{ marginTop: '-5px' }}>
						<Typography
							variant="h5"
							element="h1"
							color="primary"
							fontWeight="bold"
						>
							BattleSound
						</Typography>
						<Typography>EN | RU | UA</Typography>
					</Grid>
					<Grid item xs={6} md={3}>
						<Grid container spacing={1}>
							<Grid item xs={12} sx={{ display: 'flex' }}>
								<Box
									sx={{
										width: '20px',
										display: 'inline-block',
										marginRight: '5px'
									}}
								>
									{/* filter via https://codepen.io/sosuke/pen/Pjoqqp */}
									<Image
										src="/img/shelling-icon.png"
										alt="Icons on the map representing different events"
										width="20px"
										height="20px"
									/>
								</Box>
								<Typography sx={{ display: 'inline-block' }}>
									Detected Shelling
								</Typography>
							</Grid>
							<Grid item xs={12} sx={{ display: 'flex' }}>
								<Box
									sx={{
										width: '20px',
										display: 'inline-block',
										marginRight: '5px'
									}}
								>
									{/* filter via https://codepen.io/sosuke/pen/Pjoqqp */}
									<Image
										src="/img/confidence_area.png"
										alt="Icons on the map representing different events"
										width="20px"
										height="20px"
									/>
								</Box>
								<Typography sx={{ display: 'inline-block' }}>
									Confidence Radius
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={5}>
						<Timeline
							data={data}
							setCurrentObject={setCurrentObject}
						/>
					</Grid>
					<Grid item xs={12} md={2}>
						<Button
							variant="text"
							onClick={handleToggleModal}
							sx={{
								margin: 0,
								padding: '0 10px',
								background: 'white',
								color: 'black',
								borderRadius: '0',
								marginLeft: '5px'
							}}
						>
							Methods &amp; About
						</Button>
						<br />
						<br />
						<Link href="/methods">
							<a
								style={{
									padding: '2px 10px',
									background: 'white',
									color: 'black',
									borderRadius: '0',
									margin: '10px 0 0 5px',
									textTransform: 'uppercase',
									fontFamily: "'Jost', sans-serif",
									fontSize: '.875rem',
									transform: 'translateY(5px)'
								}}
							>
								Narrative
							</a>
						</Link>
					</Grid>
				</Grid>
			</Box>
			<MethodModalShort
				open={modalOpen}
				handleClose={handleToggleModal}
			/>
		</>
	)
}

const modalStyling = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	maxWidth: '80%',
	maxHeight: '80%',
	background: '#192432',
	padding: '1em',
	color: 'white'
}

const MethodModalShort = ({ open, handleClose }) => {
	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="simple-modal-title"
			aria-describedby="simple-modal-description"
		>
			<Box sx={modalStyling}>
				<Box
					sx={{
						width: '100%',
						height: '100%',
						position: 'relative',
						paddingRight: '40px'
					}}
				>
					<Typography variant="h5" element="h1" color="primary">
						Methods and Technology
					</Typography>
					<br/><br/>
					<Typography sx={{maxWidth:'60ch'}}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit,
						sed do eiusmod tempor incididunt ut labore et dolore
						magna aliqua. Et malesuada fames ac turpis. Tincidunt
						nunc pulvinar sapien et ligula ullamcorper. Ipsum a arcu
						cursus vitae congue mauris rhoncus. Interdum velit
						laoreet id donec. Nulla facilisi nullam vehicula ipsum a
						arcu cursus vitae. Tortor at auctor urna nunc id cursus
						metus aliquam eleifend. Tellus mauris a diam maecenas
						sed. Viverra maecenas accumsan lacus vel facilisis
						volutpat. Tempor commodo ullamcorper a lacus vestibulum.
						Magna ac placerat vestibulum lectus mauris ultrices
						eros. Rutrum quisque non tellus orci ac auctor augue
						mauris augue. Posuere lorem ipsum dolor sit amet
						consectetur adipiscing elit duis. Tortor dignissim
						convallis aenean et tortor at risus viverra. Sed lectus
						vestibulum mattis ullamcorper. Euismod in pellentesque
						massa placerat.
						<br />
						<br />
						Felis eget nunc lobortis mattis. Ut lectus arcu bibendum
						at varius vel. Nunc sed augue lacus viverra vitae
						congue. Eleifend mi in nulla posuere sollicitudin
						aliquam ultrices sagittis. Enim facilisis gravida neque
						convallis a cras semper auctor neque. Libero justo
						laoreet sit amet cursus sit amet. Vitae et leo duis ut
						diam. Vulputate ut pharetra sit amet aliquam. Nulla
						pellentesque dignissim enim sit. At varius vel pharetra
						vel.
					</Typography>
					<Button
						onClick={handleClose}
						sx={{
							position: 'absolute',
							right: 0,
							top: 0,
							width: '20px',
							height: '20px',
							minWidth: '20px',
							minHeight: '20px'
						}}
					>
						&times;
					</Button>
				</Box>
			</Box>
		</Modal>
	)
}

const getDate = (x) => x.time
const width = 300
const height = 50
const Timeline = ({ data, setCurrentObject }) => {
	return (
		<ParentSize>
			{(parent) => (
				<TimelineInner
					width={parent.width}
					height={height}
					data={data}
					setCurrentObject={setCurrentObject}
				/>
			)}
		</ParentSize>
	)
}

const margin = {
	top: 20,
	right: 20,
	bottom: 20,
	left: 20
}

const TimelineInner = ({ width, height, data, setCurrentObject }) => {
	const scaleDate = useMemo(
		() =>
			scaleTime({
				range: [0, width - margin.left - margin.right],
				domain: extent(data, getDate)
			}),
		[width, data.length],
		[] // eslint-disable-line react-hooks/exhaustive-deps
	) 

	return (
		<svg width={width} height={height}>
			<Text
				verticalAnchor="start"
				color="white"
				fill="white"
				fontFamily='"Jost", sans-serif'
				fontWeight="bold"
			>
				Detection Timeline
			</Text>
			<g transform="translate(0,20)">
				{data.map((d, i) => {
					const x = scaleDate(d.time)
					const y = 5
					const r = 2
					const color = '#ff0000'
					return (
						<g key={i}>
							<circle
								cx={x}
								cy={y}
								r={r}
								fill={color}
								onClick={() => setCurrentObject(d)}
							/>
						</g>
					)
				})}
				<Axis
					scale={scaleDate}
					label="Date"
					top="10"
					stroke={'white'}
					tickStroke={'white'}
					tickLabelProps={() => ({
						fill: 'white',
						fontSize: 8,
						textAnchor: 'middle',
						fontFamily: "'Jost', sans-serif"
					})}
					tickFormat={(d) => {
						return `${d.getMonth() + 1}-${d.getDay() + 1}`
					}}
				/>
			</g>
		</svg>
	)
}
