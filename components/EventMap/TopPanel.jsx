import React from 'react'
import { Box, Grid, Typography, Button, Divider, Stack } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { Timeline } from './Timeline'

export function TopPanel({
	iconMapping,
	activePhone,
	setActivePhone,
	data,
	soundData,
    handleChartClick
}) {
	return (
		<Box
			sx={{
				background: '#192432',
				padding: '1em',
				color: 'white',
				boxShadow: '0px 0px 10px rgba(0,0,0,0.9)'
			}}
		>
			<Grid container spacing={1}>
				<Grid item xs={6} md={2} sx={{ mt: 0, mb: 0 }}>
					<Typography
						element="h1"
						color="primary"
						fontWeight="bold"
					>
						Sounds of Ukraine
					</Typography>
					<Typography element="h2" sx={{ mb: 0 }}>
						Mapping the sounds of Kyiv
					</Typography>
				</Grid>
				<Grid item xs={6} md={8}>
					<Typography>
						The timeline below shows audio signals from our microphones across the city. Click on a marker to listen to the sound. 
						<br/>
						Around each event, the circle represents the confidence radius where the event is most likely to have occured.
					</Typography>
				</Grid>
				<Grid
					item
					xs={6}
					md={2}
					display="flex"
					flexDirection="column"
					justifyContent="flex-end"
					alignContent="flex-end"
					flexWrap="wrap"
				>
					{/* <Box>
						<Link href="/methods">
							<a
								style={{
									padding: '2px 10px',
									background: 'white',
									color: 'black',
									borderRadius: '0',
									margin: '10px 0 0 5px',
									textTransform: 'uppercase',
									fontFamily: "'Jost', sans-serif",
									fontSize: '.875rem',
									transform: 'translateY(5px)'
									
								}}
							>
								Narrative
							</a>
						</Link>
					</Box> */}
					<Typography sx={{ mt: 1 }}>EN | RU | UA</Typography>
				</Grid>
				<Grid item xs={12} sx={{ mb: 1 }}>
					<Divider />
				</Grid>
				<Grid item xs={1}>
					{['phone1', 'phone2', 'phone3'].map((phone, i) => (
						<Button
							key={phone}
							variant={
								activePhone === phone ? 'contained' : 'text'
							}
							color="primary"
							size="small"
							onClick={() => setActivePhone(phone)}
							sx={{
								display: 'block',
								textTransform: 'none'
							}}
						>
							{phone}
						</Button>
					))}
				</Grid>
				<Grid item xs={10} md={9} lg={9}>
					<Timeline
						{...{
							data,
							soundData,
							handleChartClick,
							activePhone
						}}
					/>
				</Grid>

				<Grid item xs={12} md={2}>
					<Stack>
						{Object.entries(iconMapping).map(([key, _value]) => (
							<Box
								alignItems="flex-start"
								display="flex"
								key={key}
							>
								<Box
									sx={{
										width: '20px',
										display: 'inline-block',
										marginRight: '5px'
									}}
								>
									<Image
										src={`/img/${key}.png`}
										alt="Icons on the map representing different events"
										width="20px"
										height="20px"
									/>
								</Box>
								<Typography
									sx={{
										display: 'inline-block',
										textTransform: 'lowercase'
									}}
								>
									{key}
								</Typography>
							</Box>
						))}

						<Box sx={{ display: 'flex' }}>
							<Box
								sx={{
									width: '20px',
									display: 'inline-block',
									marginRight: '5px'
								}}
							>
								{/* filter via https://codepen.io/sosuke/pen/Pjoqqp */}
								<Image
									src="/img/confidence_area.png"
									alt="Icons on the map representing different events"
									width="20px"
									height="20px"
								/>
							</Box>
							<Typography sx={{ display: 'inline-block' }}>
								Confidence Radius
							</Typography>
						</Box>
					</Stack>
				</Grid>
			</Grid>
		</Box>
	)
}
