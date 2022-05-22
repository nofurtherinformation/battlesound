import React from 'react'
import { Stack, Button } from '@mui/material'

export function MapButtons({ setViewport }) {
	return (
		<Stack
			sx={{
				position: 'absolute',
				bottom: '2em',
				right: '.5em'
			}}
		>
			<Button
				sx={{
					color: 'white',
					background: '#192432',
					width: '3em',
					height: '3em',
					minWidth: '3em',
					marginBottom: '.5em',
					fontSize: '1rem',
					padding: 0,
					fontWeight: 'bold'
				}}
				onClick={() => setViewport((p) => ({ ...p, zoom: p.zoom + 1 }))}
			>
				+
			</Button>
			<Button
				sx={{
					color: 'white',
					background: '#192432',
					width: '3em',
					height: '3em',
					minWidth: '3em',
					fontSize: '1rem',
					padding: 0,
					fontWeight: 'bold'
				}}
				onClick={() => setViewport((p) => ({ ...p, zoom: p.zoom - 1 }))}
			>
				–
			</Button>
		</Stack>
	)
}
