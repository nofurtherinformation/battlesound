import DeckGL from '@deck.gl/react'
import MapGL from 'react-map-gl'
import { useLitteraMethods } from '@assembless/react-littera'
const INITIAL_VIEW_STATE = {
	longitude: 30.54414,
	latitude: 50.439188,
	zoom: 10,
	maxZoom: 22,
	pitch: 0,
	bearing: 0
}
const mapStyle = 'mapbox://styles/dhalpern/cl1egbfzy000614o34nfogjod'
const MAPBOX_TOKEN =
	'pk.eyJ1IjoiZGhhbHBlcm4iLCJhIjoiY2p3MHFvZHg2MDcyczQ4bXBjNW85aDh2OCJ9.OUluk6vAGe5BVXLOiGIoQQ'

export default function Map({ data }) {
	const {locale} = useLitteraMethods()
	return (
		<DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true}>
			<MapGL
                locale={locale}
				mapboxAccessToken={MAPBOX_TOKEN}
				// reuseMaps
				mapStyle={mapStyle}
				// preventStyleDiffing={true}
			/>
		</DeckGL>
	)
}
