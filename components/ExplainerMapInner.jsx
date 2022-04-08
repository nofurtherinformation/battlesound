import { useState, useEffect } from 'react'
import { IconLayer, LineLayer, ScatterplotLayer } from '@deck.gl/layers'
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

const possiblePhoneLocations = [
    [
        [30.518420,50.453238],
        [30.511699,50.453366],
        [30.518451,50.455494]
    ],
    [
        [30.532587,50.441980],
        [30.536207,50.441360],
        [30.538543,50.439177]
    ],
    [
        [30.509890,50.439318],
        [30.507493,50.439685],
        [30.503617,50.441299]
    ]
]
const shellingLocation  = [30.547100,50.451737]
const PhoneLocations = possiblePhoneLocations.map(f => f[Math.round(Math.random() * (f.length - 1))])
const LineData = PhoneLocations.map((row, idx) => ({
    origin: shellingLocation,
    destination: row,
    }))
const RadiusData = Array(8).fill(null).map((_, idx) => ({
    origin: shellingLocation,
    radius: (idx+1) * 100
}))

const ICON_MAPPING = {
    marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
};

export default function ExplainerMapInner({ currentStepIndex, currentStepProgress}) {
    const [highlight, setHighlight] = useState(false)
    
    useEffect(() => {
        const interval = setInterval(() => {
          setHighlight(prev => !prev)
        }, 1000);
        return () => clearInterval(interval);
      }, []);
      
    const layers = [
        new ScatterplotLayer({
            data: RadiusData,
            id: "radiuses",
            pickable: false,
            opacity: 1,
            stroked: true,
            filled: false,
            radiusScale: 6,
            lineWidthMinPixels: 2,
            getPosition: d => d.origin,
            getRadius: d => {
                if (currentStepIndex === 4) {
                    return d.radius * currentStepProgress
                }
                if (currentStepIndex > 4) {
                    return d.radius
                }
            },
            getLineColor: d => currentStepIndex > 4 ? [230, 120, 0, 50] : [230, 120, 0, 255],
            visible: currentStepIndex > 3,
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
            id: "lines",
            getWidth: 2,
            getSourcePosition: d => d.origin,
            getTargetPosition: d => d.destination,
            getColor: d => [230, 120, 0],
            visible: currentStepIndex > 4,
        }),

        new ScatterplotLayer({
            data: [
                ...PhoneLocations,
                shellingLocation
            ],
            id: "icon backgrounds",
            pickable: false,
            opacity: 1,
            stroked: true,
            filled: true,
            radiusScale: 6,
            lineWidthMinPixels: 2,
            getPosition: d => d,
            getRadius: d => 50,
            getLineColor: d => [230, 120, 0, 255],
            getFillColor: d => [0, 76, 154, 255],
            visible: currentStepIndex > 4,
            updateTriggers: {
                getRadius: [currentStepIndex, currentStepProgress],
                getLineColor: [currentStepIndex, currentStepProgress],
                visible: currentStepIndex
            }
        }),
        new IconLayer({
            data: PhoneLocations,
            id:"phones",
            getPosition: d => d,
            getSize: d => 5,
            getColor: d => {
                if (currentStepIndex < 3) {
                    return [255, 255, 0, 0]
                } 
                if (currentStepIndex === 3) {
                    return highlight ? [255, 255, 0, 255] : [255, 255, 0, 120]
                } 
                if (currentStepIndex > 3) {
                    return [255, 255, 0, 255]
                }
            },
            iconAtlas: '/img/noun-phone-3095128.png',
            iconMapping: ICON_MAPPING,
            getIcon: d => 'marker',
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
            id:"shelling",
            getPosition: d => d.origin,
            getSize: d => 5,
            getColor: d => [230, 120, 0],
            iconAtlas: '/img/noun-artillery-shell-827138.png',
            iconMapping: ICON_MAPPING,
            getIcon: d => 'marker',
            sizeScale: 16,
            pickable: false,
            visible: currentStepIndex > 3,
            updateTriggers: {
                getColor: [currentStepIndex, highlight],
                visible: currentStepIndex
            },
            transitions: {
                getColor: 750
            }
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
				opacity: currentStepIndex > 1 && currentStepIndex < 6 ? 1 : 0,
				transition: '250ms all'
			}}
		>
			<Map INITIAL_VIEW_STATE={INITIAL_VIEW_STATE} layers={layers} controller={false}/>
		</div>
	)
}
