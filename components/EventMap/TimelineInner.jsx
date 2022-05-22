import React, { useMemo } from 'react'
import { extent } from 'd3-array'
import { scaleTime, scaleLinear } from '@visx/scale'
import { AxisBottom } from '@visx/axis'
import { Group } from '@visx/group'
import { LinePath } from '@visx/shape'
import { Text } from '@visx/text'

const getPhone1 = (x) => x.phone1
const getPhone2 = (x) => x.phone2
const getPhone3 = (x) => x.phone3
const getDate = (x) => x.time

const margin = {
	top: 20,
	right: 20,
	bottom: 50,
	left: 20
}

const getDaysAgo = (date, days) => {
	let tempDate = new Date(date)
	tempDate.setDate(tempDate.getDate() - days)
	return tempDate
}

const TimelineInner = ({
	width,
	height,
	data,
	soundData,
	handleChartClick,
	activePhone
}) => {
	const xMax = width - margin.left - margin.right
	const yMax = height - margin.top - margin.bottom
	const dateExtent = extent(soundData, getDate);
	
	const scaleDate = useMemo(
		() =>
			scaleTime({
				range: [
					margin.left, 
					xMax/4, 
					xMax/2, 
					xMax
				],
				domain: [
					dateExtent[0], 
					getDaysAgo(dateExtent[1], 2), 
					getDaysAgo(dateExtent[1], 1), 
					dateExtent[1]
				]
			}),
		[width, soundData?.length] // eslint-disable-line react-hooks/exhaustive-deps
	)

	const scaleFrequency = useMemo(
		() =>
			scaleLinear({
				range: [yMax, 0],
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

export default React.memo(TimelineInner)