import React from 'react';
import { ParentSize } from '@visx/responsive';
import TimelineInner from  './TimelineInner';

const height = 150

export const Timeline = ({ data, soundData, handleChartClick, activePhone }) => {
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