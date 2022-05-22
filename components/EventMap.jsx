import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
// MAP
import DeckGL, { FlyToInterpolator } from '@deck.gl/react'
import ReactMapGl, { Marker, NavigationControl } from 'react-map-gl'
import { MapboxLayer } from '@deck.gl/mapbox'
import { IconLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers'
import Papa from 'papaparse'
import { DataFilterExtension, FillStyleExtension } from '@deck.gl/extensions'
// meta
import { useLitteraMethods } from '@assembless/react-littera'
import {
	Box,
	Button,
	Divider,
	Grid,
	Icon,
	Modal,
	Typography
} from '@mui/material'
import { max, extent } from 'd3-array'
import { scaleTime, scaleLinear, scaleLog } from '@visx/scale'

import 'mapbox-gl/dist/mapbox-gl.css'
import { Axis, AxisBottom, AxisLeft } from '@visx/axis'
import Stack from '@mui/material/Stack'
import { Group } from '@visx/group'
import { LinePath } from '@visx/shape'
import Image from 'next/image'
import { ParentSize } from '@visx/responsive'
import { Text } from '@visx/text'
import Link from 'next/link'
import { useSetViewport, useViewport } from '../contexts/Viewport'
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

export default function EventMap({ controller = true }) {
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
	const [glContext, setGLContext] = useState()
	const { locale } = useLitteraMethods()
	const mapRef = useRef()
	const deckRef = useRef()

	const dateRange = extent(data, getDate)
	const getDateScale = () => {
		const max = dateRange[1]
		let min = new Date(dateRange[1])
		min.setDate(min.getDate() - 7)

		const scale = scaleTime()
			.domain([min, max])
			.range(['#d3d3d3', '#ff0000'])
		return scale
	}
	const dateScale = getDateScale()

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
			getColor: (d) => {
				if (!currentObject?.id || currentObject.id === d.id) {
					return dateScale(d.time).slice(4,-1).split(',').map(x => parseInt(x))
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
			<Stack spacing={0} sx={{ height: '100vh' }}>
				<Box
					sx={{
						background: '#192432',
						padding: '1em',
						color: 'white',
						boxShadow: '0px 0px 10px rgba(0,0,0,0.9)'
					}}
				>
					<Grid container spacing={1}>
						<Grid item xs={6} md={3} sx={{ mt: 0, mb: 0 }}>
							<Typography
								variant="h5"
								element="h1"
								color="primary"
								fontWeight="bold"
							>
								Sounds of Ukraine
							</Typography>
							<Typography variant="h6" sx={{ mb: 0 }}>
								Mapping the sounds of Kyiv
							</Typography>
							<Typography sx={{ mr: 3 }}>EN | RU | UA</Typography>
						</Grid>
						<Grid item xs={6} md={7}>
							<Typography>
								Lorem ipsum dolor sit amet, consectetur
								adipiscing elit. Etiam lorem ante, egestas a
								tristique eget, ullamcorper sed enim. Integer
								tellus nisl, ornare non rutrum ac, euismod ut
								eros. Praesent laoreet dictum lectus vel rutrum.
								Mauris porttitor pretium auctor. Mauris nec
								tempus metus, vitae convallis tellus.
							</Typography>
						</Grid>
						<Grid
							item
							xs={6}
							md={2}
							display="flex"
							flexDirection="row"
							justifyContent="flex-end"
						>
							<Box>
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
							</Box>
						</Grid>
						<Grid item xs={12} sx={{ mb: 2 }}>
							<Divider />
						</Grid>
						<Grid item xs={1}>
							{['phone1', 'phone2', 'phone3'].map((phone, i) => (
								<Button
									key={phone}
									variant={
										activePhone === phone
											? 'contained'
											: 'outlined'
									}
									color="primary"
									size="small"
									onClick={() => setActivePhone(phone)}
									sx={{
										display: 'block',
										textTransform: 'none'
									}}
								>
									{phone}
								</Button>
							))}
						</Grid>
						<Grid item xs={10} md={9} lg={9}>
							<Timeline
								data={data}
								soundData={soundData}
								handleChartClick={handleChartClick}
								activePhone={activePhone}
							/>
						</Grid>

						<Grid item xs={12} md={2}>
							<Stack>
								{Object.entries(ICON_MAPPING).map(
									([key, _value]) => (
										<Box
											alignItems="flex-start"
											display="flex"
											key={key}
										>
											<Box
												sx={{
													width: '20px',
													display: 'inline-block',
													marginRight: '5px'
												}}
											>
												<Image
													src={`/img/${key}.png`}
													alt="Icons on the map representing different events"
													width="20px"
													height="20px"
												/>
											</Box>
											<Typography
												sx={{
													display: 'inline-block',
													textTransform: 'lowercase'
												}}
											>
												{key}
											</Typography>
										</Box>
									)
								)}

								<Box sx={{ display: 'flex' }}>
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
									<Typography
										sx={{ display: 'inline-block' }}
									>
										Confidence Radius
									</Typography>
								</Box>
							</Stack>
						</Grid>
					</Grid>
				</Box>
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
							{data.map((row, idx) => (
								<Marker
									latitude={row.y}
									longitude={row.x}
									anchor="bottom"
									offset={[0, -40]}
									key={'marker-' + idx}
									style={{
										display:
											viewport.zoom > 11.5 ||
											currentObject.id === row.id
												? 'initial'
												: 'none'
									}}
								>
									<Box
										sx={{
											padding: '.5em',
											boxShadow:
												'0px 0px 10px rgba(0,0,0,0.9)',
											background: '#192432',
											pointerEvents: 'none',
											zIndex: 500000
										}}
									>
										<Typography
											sx={{ lineHeight: 1 }}
											color="primary"
										>
											<b>{row.type.toLowerCase()}</b>{' '}
											<br />
											{row.time.toLocaleDateString()}
											<br />
											<br />
											{Math.round(row.x * 100000) /
												100000}
											,
											{Math.round(row.y * 100000) /
												100000}
											<br />
											<b>Confidence Radius:</b>{' '}
											{Math.round(row.radius)}m{' '}
										</Typography>
									</Box>
								</Marker>
							))}
						</ReactMapGl>
					</DeckGL>
					<Stack
						sx={{
							position: 'absolute',
							bottom: '2em',
							right: '.5em'
						}}
					>
						<Button
							sx={{
								color: 'white',
								background: '#192432',
								width: '3em',
								height: '3em',
								minWidth: '3em',
								marginBottom: '.5em',
								fontSize: '1rem',
								padding: 0,
								fontWeight: 'bold'
							}}
							onClick={() =>
								setViewport((p) => ({ ...p, zoom: p.zoom + 1 }))
							}
						>
							+
						</Button>
						<Button
							sx={{
								color: 'white',
								background: '#192432',
								width: '3em',
								height: '3em',
								minWidth: '3em',
								fontSize: '1rem',
								padding: 0,
								fontWeight: 'bold'
							}}
							onClick={() =>
								setViewport((p) => ({ ...p, zoom: p.zoom - 1 }))
							}
						>
							–
						</Button>
					</Stack>
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
					<br />
					<br />
					<Typography sx={{ maxWidth: '60ch' }}>
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
const getPhone1 = (x) => x.phone1
const getPhone2 = (x) => x.phone2
const getPhone3 = (x) => x.phone3

const height = 150

const Timeline = ({ data, soundData, handleChartClick, activePhone }) => {
	return (
		<ParentSize>
			{(parent) => (
				<TimelineInner
					width={parent.width}
					height={height}
					data={data}
					soundData={soundData}
					handleChartClick={handleChartClick}
					activePhone={activePhone}
				/>
			)}
		</ParentSize>
	)
}

const margin = {
	top: 20,
	right: 20,
	bottom: 50,
	left: 20
}

const TimelineInner = ({
	width,
	height,
	data,
	soundData,
	handleChartClick,
	activePhone
}) => {
	const scaleDate = useMemo(
		() =>
			scaleTime({
				range: [margin.left, width - margin.left - margin.right],
				domain: extent(soundData, getDate)
			}),
		[width, soundData?.length] // eslint-disable-line react-hooks/exhaustive-deps
	)

	const scaleFrequency = useMemo(
		() =>
			scaleLinear({
				range: [height - margin.top - margin.bottom, 0],
				domain: [0, 5000]
			}),
		[soundData?.length] // eslint-disable-line react-hooks/exhaustive-deps
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
			{data.map((d, i) => {
				const x = Math.min(
					scaleDate(d.time),
					width - margin.left - margin.right
				)
				const y = height - 20
				const r = 4
				const color = '#ff0000'
				return (
					<g key={i}>
						<circle
							cx={x}
							cy={y}
							r={r}
							fill={color}
						/>
						<circle
							cx={x}
							cy={y}
							r={40}
							fill={'rgba(0,0,0,0'}
							onClick={() => handleChartClick(d)}
							onMouseEnter={() => handleChartClick(d)}
							onMouseLeave={() => handleChartClick(null)}
						/>
						<line
							x1={x}
							y1={margin.top}
							x2={x}
							y2={height - margin.bottom}
							stroke="red"
							strokeDasharray="2,2"
						/>
						<line
							x1={x}
							y1={margin.top}
							x2={x}
							y2={height - margin.bottom}
							stroke="rgba(0,0,0,0)"
							strokeWidth="40"
							onClick={() => handleChartClick(d)}
							onMouseEnter={() => handleChartClick(d)}
							onMouseLeave={() => handleChartClick(null)}
						/>
					</g>
				)
			})}
			<g>
				{['phone1', 'phone2', 'phone3'].map((_phone, i) => {
					const getY = (d) => d[`phone${i + 1}`]
					return (
						<Group key={`lines-${i}`} top={margin.top}>
							<LinePath
								data={soundData}
								x={(d) => scaleDate(getDate(d))}
								y={(d) => scaleFrequency(getY(d))}
								stroke="#999"
								strokeWidth={0.5}
								strokeOpacity={
									activePhone === '' || activePhone === _phone
										? 1
										: 0.25
								}
							/>
						</Group>
					)
				})}
				<AxisBottom
					scale={scaleDate}
					label="Date"
					top={height - margin.bottom}
					stroke={'white'}
					tickStroke={'white'}
					tickLabelProps={() => ({
						fill: 'white',
						fontSize: 8,
						textAnchor: 'middle',
						fontFamily: "'Jost', sans-serif"
					})}
					// tickFormat={(d) => {
					// 	return `${d.getMonth() + 1}-${d.getDay() + 1}`
					// }}
				/>
			</g>
		</svg>
	)
}
