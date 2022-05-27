import React from 'react';
import { ParentSize } from '@visx/responsive';
import TimelineInner from  './TimelineInner';

export const Timeline = ({ data, soundData, handleChartClick, activePhone }) => {
	return (
		<ParentSize>
			{(parent) => (
				<TimelineInner
					width={parent.width}
					height={parent.height}
					data={data}
					soundData={soundData}
					handleChartClick={handleChartClick}
					activePhone={activePhone}
				/>
			)}
		</ParentSize>
	)
}