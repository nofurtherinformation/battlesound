import React, { useEffect, useMemo, useState } from 'react'
import { extent } from 'd3-array'
import { scaleTime, scaleLinear } from '@visx/scale'
import { AxisBottom } from '@visx/axis'
import { Group } from '@visx/group'
import { LinePath } from '@visx/shape'
import { Text } from '@visx/text'
import Papa from 'papaparse'

const getDate = (x) => x.time
const getVol = (x) => x.scl1
const getTime = (x) => x.t

const margin = {
	top: 20,
	right: 20,
	bottom: 50,
	left: 0
}

const RealtimeTimelineInner = ({
	width,
	height
}) => {
	const [data, setData] = useState([])
	const [timeOffset, setTimeOffset] = useState(0)
	
	const handleLoadData = (data) => {
		const hz = data.data.length / 60
		setData(data.data.map((d,i) => ({...d, t: i/hz})))
	}

	const fetchData = async () => {
		Papa.parse('/data/sound_record.csv', {
			header: true,
			download: true,
			dynamicTyping: true,
			complete: handleLoadData
		})
	}

	useEffect(() => {
		fetchData()
		const offsetInterval = setInterval(() => setTimeOffset(p => (p+.05)%60), 50)
		const dataInterval = setInterval(() => fetchData(), 60 * 1000)
		
		return () => {
			clearInterval(offsetInterval)
			clearInterval(dataInterval)
		}
	}, [])
	
	const xMax = width - margin.left - margin.right
	const yMax = height - margin.top - margin.bottom
	const soundLength = data?.length
	const soundExtent = [0, soundLength]
	const graphWidth = xMax * soundLength
	const xOffset = xMax * timeOffset * -1
	
	const xScale = scaleLinear({
		range: [0, graphWidth],
		domain: soundExtent
	})

	const yScale = useMemo(
		() =>
			scaleLinear({
				range: [yMax, 0],
				domain: extent(data, getVol)
			}),
		[data?.length] // eslint-disable-line react-hooks/exhaustive-deps
	)

	const line = useMemo(() => {
		return <LinePath
		data={data}
		x={(d) => xScale(getTime(d))}
		y={(d) => yScale(getVol(d))}
		stroke={'white'}
		strokeWidth={0.5}
	/>
	},[data.length])
	if (!data?.length){
		return null
	}

	return (
		<svg width={width} height={height}>
			<g>
				<text x={xMax/2} y={yMax + margin.bottom - 10} fill="white" textAnchor='middle' fontFamily="Arial, sans-serif" fontSize="10px">
					Realtime Data
				</text>
				<Group left={xOffset}>
					{line}
					<AxisBottom
						scale={xScale}
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
					/>
				</Group>
			</g>
		</svg>
	)
}

export default React.memo(RealtimeTimelineInner)