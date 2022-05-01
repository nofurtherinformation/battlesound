import { useState, useRef, useCallback } from 'react'
import DeckGL from '@deck.gl/react'
import MapGL from 'react-map-gl'
import { MapboxLayer } from '@deck.gl/mapbox'
import { useLitteraMethods } from '@assembless/react-littera'
import 'mapbox-gl/dist/mapbox-gl.css'
const mapStyle = 'mapbox://styles/dhalpern/cl2ih86m6000414lt3r30nf6h'
const MAPBOX_TOKEN =
	'pk.eyJ1IjoiZGhhbHBlcm4iLCJhIjoiY2p3MHFvZHg2MDcyczQ4bXBjNW85aDh2OCJ9.OUluk6vAGe5BVXLOiGIoQQ'

export default function Map({
	layers = [],
	INITIAL_VIEW_STATE,
	controller = true,
	viewState = {
		longitude: 30.51414,
		latitude: 50.439188,
		zoom: 12.5,
		maxZoom: 22,
		pitch: 0
	},
	setViewState = () => {},
	children
}) {
	const [glContext, setGLContext] = useState()
	const { locale } = useLitteraMethods()
	const mapRef = useRef()
	const deckRef = useRef()

	const onMapLoad = useCallback(() => {
		if (mapRef.current === undefined) return
		const map = mapRef.current.getMap()
		const deck = deckRef.current.deck
		layers.forEach(({ id }) => {
			map.addLayer(new MapboxLayer({ id, deck }), 'road-label-simple')
		})
	}, []) //eslint-disable-line react-hooks/exhaustive-deps

	return (
		<DeckGL
			initialViewState={INITIAL_VIEW_STATE}
			controller={controller}
			layers={layers}
			pickingRadius={20}
			ref={deckRef}
			onWebGLInitialized={setGLContext}
		>
			<MapGL
				locale={locale}
				mapboxAccessToken={MAPBOX_TOKEN}
				reuseMaps
				mapStyle={mapStyle}
				preventStyleDiffing={true}
				ref={mapRef}
				gl={glContext}
				onLoad={() => {
					onMapLoad()
				}}
			>
				{children}
			</MapGL>
		</DeckGL>
	)
}
