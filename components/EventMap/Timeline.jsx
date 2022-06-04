import React from 'react';
import { ParentSize } from '@visx/responsive';
import TimelineInner from  './TimelineInner';
import RealtimeTimelineInner from './RealtimeTimelineInner'

export const Timeline = ({ data, soundData, handleChartClick, activePhone }) => {
	
		// WE NEED REAL DATA THIS IS FAKE!!!!
		// WE NEED REAL DATA THIS IS FAKE!!!!
		// WE NEED REAL DATA THIS IS FAKE!!!!
		// WE NEED REAL DATA THIS IS FAKE!!!!
		// WE NEED REAL DATA THIS IS FAKE!!!!
		// WE NEED REAL DATA THIS IS FAKE!!!!
		// WE NEED REAL DATA THIS IS FAKE!!!!
	return (
		<ParentSize>
			{(parent) => (
				<>
					<TimelineInner
						width={(parent.width/4)*3}
						height={parent.height}
						data={data}
						soundData={soundData}
						handleChartClick={handleChartClick}
						activePhone={activePhone}
					/>
					<RealtimeTimelineInner
						width={(parent.width/4)}
						height={parent.height}
					/>
				</>
			)}
		</ParentSize>
	)
}