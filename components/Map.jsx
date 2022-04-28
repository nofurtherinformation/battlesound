import DeckGL from '@deck.gl/react'
import MapGL from 'react-map-gl'
import { useLitteraMethods } from '@assembless/react-littera'

const mapStyle = 'mapbox://styles/dhalpern/cl2ih86m6000414lt3r30nf6h'
const MAPBOX_TOKEN =
	'pk.eyJ1IjoiZGhhbHBlcm4iLCJhIjoiY2p3MHFvZHg2MDcyczQ4bXBjNW85aDh2OCJ9.OUluk6vAGe5BVXLOiGIoQQ'

export default function Map({ 
	layers = [], 
	INITIAL_VIEW_STATE, 
	controller=true,
	viewState={
		longitude: 30.51414,
		latitude: 50.439188,
		zoom: 12.5,
		maxZoom: 22,
		pitch: 0,
	},
	setViewState=()=>{}
}) {
	const {locale} = useLitteraMethods()
	return (
		<DeckGL 
			initialViewState={INITIAL_VIEW_STATE} 
			controller={controller}
			layers={layers}
			>
			<MapGL
                locale={locale}
				mapboxAccessToken={MAPBOX_TOKEN}
				reuseMaps
				mapStyle={mapStyle}
				preventStyleDiffing={true}
			/>
		</DeckGL>
	)
}
