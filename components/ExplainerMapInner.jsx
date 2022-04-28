import DeckGL from '@deck.gl/react'
import MapGL from 'react-map-gl'

import { useState, useEffect, useCallback } from 'react'
import { IconLayer, LineLayer, ScatterplotLayer } from '@deck.gl/layers'
import { FlyToInterpolator } from '@deck.gl/core'
import { useLitteraMethods } from '@assembless/react-littera'
import Image from 'next/image'
import Map from './Map'

const INITIAL_VIEW_STATE = {
	longitude: 30.51414,
	latitude: 50.439188,
	zoom: 12.5,
	maxZoom: 22,
	pitch: 0,
	bearing: 0
}

const mapStyle = 'mapbox://styles/dhalpern/cl1egbfzy000614o34nfogjod'
const MAPBOX_TOKEN =
	'pk.eyJ1IjoiZGhhbHBlcm4iLCJhIjoiY2p3MHFvZHg2MDcyczQ4bXBjNW85aDh2OCJ9.OUluk6vAGe5BVXLOiGIoQQ'
const possiblePhoneLocations = [
	[
		[30.51842, 50.453238],
		[30.511699, 50.453366],
		[30.518451, 50.455494]
	],
	[
		[30.532587, 50.44198],
		[30.536207, 50.44136],
		[30.538543, 50.439177]
	],
	[
		[30.50989, 50.439318],
		[30.507493, 50.439685],
		[30.503617, 50.441299]
	]
]
const shellingLocation = [30.5471, 50.451737]
const PhoneLocations = possiblePhoneLocations.map(
	(f) => f[Math.round(Math.random() * (f.length - 1))]
)
const LineData = PhoneLocations.map((row, idx) => ({
	origin: shellingLocation,
	destination: row
}))
const RadiusData = Array(8)
	.fill(null)
	.map((_, idx) => ({
		origin: shellingLocation,
		radius: (idx + 1) * 100
	}))

const ICON_MAPPING = {
	marker: { x: 0, y: 0, width: 128, height: 128, mask: true }
}

export default function ExplainerMapInner({
	currentStepIndex,
	currentStepProgress,
	baseStep
}) {
	const [highlight, setHighlight] = useState(false)
	const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)
	const { locale } = useLitteraMethods()

	const goToNYC = () => {
		setViewState(prev => ({
            ...prev,
			longitude: 30.319,
			latitude: 59.947,
			zoom: 15.5,
			pitch: 60,
			bearing: 0,
			transitionDuration: 1000,
			transitionInterpolator: new FlyToInterpolator()
		}))
	}

	const goToKyiv = () => {
		setViewState((prev) => ({
			...prev,
			...INITIAL_VIEW_STATE,
			pitch: 0,
			bearing: 0,
			transitionDuration: 1000,
			transitionInterpolator: new FlyToInterpolator(),
		}))
	}

	const rotateCamera = () => {
		setViewState((prev) => ({
			...prev,
			bearing: (prev.bearing + 90) % 360,
			transitionDuration: 5000,
			transitionInterpolator: new FlyToInterpolator({speed: 2})
		}))
	}
	// useEffect(() => {
	// 	rotateCamera()
	// },[currentStepIndex])

	useEffect(() => {
		const interval = setInterval(() => {
			setHighlight((prev) => !prev)
		}, 1000)
		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		if (currentStepIndex === baseStep + 3) {
			goToNYC()
		} else if (currentStepIndex === baseStep + 2) {
			goToKyiv()
		}
	}, [currentStepIndex]) //eslint-disable-line

	const layers = [
		new ScatterplotLayer({
			data: RadiusData,
			id: 'radiuses',
			pickable: false,
			opacity: 1,
			stroked: true,
			filled: false,
			radiusScale: 6,
			lineWidthMinPixels: 2,
			getPosition: (d) => d.origin,
			getRadius: (d) => {
				if (currentStepIndex === baseStep + 1) {
					return d.radius * currentStepProgress
				}
				if (currentStepIndex > baseStep + 1) {
					return d.radius
				}
			},
			getLineColor: (d) =>
				currentStepIndex > baseStep + 1
					? [230, 120, 0, 50]
					: [230, 120, 0, 255],
			visible: currentStepIndex > baseStep,
			updateTriggers: {
				getRadius: [currentStepIndex, currentStepProgress],
				getLineColor: [currentStepIndex, currentStepProgress],
				visible: currentStepIndex
			},
			transitions: {
				getLineColor: 250
			}
		}),
		new LineLayer({
			data: LineData,
			id: 'lines',
			getWidth: 2,
			getSourcePosition: (d) => d.origin,
			getTargetPosition: (d) => d.destination,
			getColor: (d) => [230, 120, 0],
			visible: currentStepIndex > baseStep + 1
		}),

		new ScatterplotLayer({
			data: [...PhoneLocations, shellingLocation],
			id: 'icon backgrounds',
			pickable: false,
			opacity: 1,
			stroked: true,
			filled: true,
			radiusScale: 6,
			lineWidthMinPixels: 2,
			getPosition: (d) => d,
			getRadius: (d) => 50,
			getLineColor: (d) => [230, 120, 0, 255],
			getFillColor: (d) => [0, 76, 154, 255],
			visible: currentStepIndex > baseStep + 1,
			updateTriggers: {
				getRadius: [currentStepIndex, currentStepProgress],
				getLineColor: [currentStepIndex, currentStepProgress],
				visible: currentStepIndex
			}
		}),
		new IconLayer({
			data: PhoneLocations,
			id: 'phones',
			getPosition: (d) => d,
			getSize: (d) => 5,
			getColor: (d) => {
				if (currentStepIndex < baseStep) {
					return [255, 255, 0, 0]
				}
				if (currentStepIndex === baseStep) {
					return highlight ? [255, 255, 0, 255] : [255, 255, 0, 120]
				}
				if (currentStepIndex > baseStep) {
					return [255, 255, 0, 255]
				}
			},
			iconAtlas: '/img/noun-phone-3095128.png',
			iconMapping: ICON_MAPPING,
			getIcon: (d) => 'marker',
			sizeScale: 8,
			pickable: false,
			// visible: currentStepIndex >= 2 && currentStepIndex < 4,
			updateTriggers: {
				getColor: [currentStepIndex, highlight]
			},
			transitions: {
				getColor: 750
			}
		}),
		new IconLayer({
			data: [LineData[0]],
			id: 'shelling',
			getPosition: (d) => d.origin,
			getSize: (d) => 5,
			getColor: (d) => [230, 120, 0],
			iconAtlas: '/img/noun-artillery-shell-827138.png',
			iconMapping: ICON_MAPPING,
			getIcon: (d) => 'marker',
			sizeScale: 16,
			pickable: false,
			visible: currentStepIndex > baseStep,
			updateTriggers: {
				getColor: [currentStepIndex, highlight],
				visible: currentStepIndex
			},
			transitions: {
				getColor: 750
			}
		}),

		new LineLayer({
			data: [
				[30.3175159,59.9483564]
			],
			id: 'cannon-indicator',
			getWidth: 2,
			getSourcePosition: (d) => [...d,0],
			getTargetPosition: (d) => [...d,250],
			getColor: (d) => [230, 120, 0],
			visible: currentStepIndex > baseStep + 3
		}),

		new ScatterplotLayer({
			data: [
				[30.3175159,59.9483564]
			],
			id: 'canon backgrounds',
			pickable: false,
			opacity: 1,
			stroked: true,
			filled: true,
			radiusScale: 6,
			lineWidthMinPixels: 2,
			getPosition: (d) => [...d, 250],
			getRadius: (d) => 10,
			billboard:true,
			getLineColor: (d) => [230, 120, 0, 255],
			getFillColor: (d) => [230, 120, 0],
			visible: currentStepIndex > baseStep + 3,
		}),
		
		new IconLayer({
			data: [
				[30.3175159,59.9483564]
			],
			id: 'cannon',
			getPosition: (d) => [...d, 250],
			getSize: (d) => 10,
			getColor: (d) => [0,0,0],
			iconAtlas: '/img/noun-artillery-3864271-FFFFFF.png',
			iconMapping: ICON_MAPPING,
			getIcon: (d) => 'marker',
			sizeScale: 8,
			pickable: false,
			visible: currentStepIndex > baseStep + 3,
		}),
		

		new LineLayer({
			data: [[30.3127857,59.9538167],[30.3255866,59.9430683],[30.2942732,59.9423764],[30.3195132,59.9429748]],
			id: 'cannon-indicator',
			getWidth: 2,
			getSourcePosition: (d) => [30.3175159,59.9483564],
			getTargetPosition: (d) => d,
			getColor: (d) => [230, 120, 0],
			visible: currentStepIndex > baseStep + 5
		}),
		new ScatterplotLayer({
			data: [[30.3127857,59.9538167],[30.3255866,59.9430683],[30.2942732,59.9423764],[30.3195132,59.9429748]],
			id: 'canon backgrounds',
			pickable: false,
			opacity: 1,
			stroked: true,
			filled: true,
			radiusScale: 6,
			lineWidthMinPixels: 2,
			getPosition: (d) => d,
			getRadius: (d) => 2,
			billboard:true,
			getLineColor: (d) => [230, 120, 0, 255],
			getFillColor: (d) => [230, 120, 0],
			visible: currentStepIndex > baseStep + 6,
		}),
	]
	
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				position: 'fixed',
				inset: 0,
				zIndex: 0,
				opacity:
					currentStepIndex > baseStep - 2 &&
					currentStepIndex < baseStep + 8
						? 1
						: 0,
				transition: '250ms all'
			}}
		>
			<DeckGL
				viewState={viewState}
				controller={false}
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
		</div>
	)
}
