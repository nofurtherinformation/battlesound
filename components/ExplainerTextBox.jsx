import React from 'react'
import { Box } from '@mui/material'
import { Step } from 'react-scrollama'

export function ExplainerTextContainer({ children }) {
	return (
		<div>
			{/* <Box position="relative" width="100%" minHeight="100vh"> */}
				
					{children}
			{/* </Box> */}
		</div>
	)
}

export function ExplainerTextBox({
	position = {},
	border = true,
	padding = '1em',
	children,
	singleCol=false
}) {
	const { width, left, top, right, bottom, minHeight } = position
	return (
		<Box
			position={singleCol ? "initial" : "absolute"}
			width={singleCol ? "100%" : width || 'auto'}
			left={left || 'initial'}
			right={right || 'initial'}
			top={top || 'initial'}
			bottom={bottom || 'initial'}
			border={border ? '1px solid white' : 'none'}
			padding={border ? padding : '0'}
			minHeight={minHeight || 'initial'}
		>
			{children}
		</Box>
	)
}
