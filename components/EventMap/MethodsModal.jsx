import React from 'react'
import { Box, Typography, Modal, Button } from '@mui/material'

const modalStyling = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	maxWidth: '80%',
	maxHeight: '80%',
	background: '#192432',
	padding: '1em',
	color: 'white'
}

export const MethodModal = ({ open, handleClose }) => {
	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="simple-modal-title"
			aria-describedby="simple-modal-description"
		>
			<Box sx={modalStyling}>
				<Box
					sx={{
						width: '100%',
						height: '100%',
						position: 'relative',
						paddingRight: '40px'
					}}
				>
					<Typography variant="h5" element="h1" color="primary">
						Methods and Technology
					</Typography>
					<br />
					<br />
					<Typography sx={{ maxWidth: '60ch' }}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit,
						sed do eiusmod tempor incididunt ut labore et dolore
						magna aliqua. Et malesuada fames ac turpis. Tincidunt
						nunc pulvinar sapien et ligula ullamcorper. Ipsum a arcu
						cursus vitae congue mauris rhoncus. Interdum velit
						laoreet id donec. Nulla facilisi nullam vehicula ipsum a
						arcu cursus vitae. Tortor at auctor urna nunc id cursus
						metus aliquam eleifend. Tellus mauris a diam maecenas
						sed. Viverra maecenas accumsan lacus vel facilisis
						volutpat. Tempor commodo ullamcorper a lacus vestibulum.
						Magna ac placerat vestibulum lectus mauris ultrices
						eros. Rutrum quisque non tellus orci ac auctor augue
						mauris augue. Posuere lorem ipsum dolor sit amet
						consectetur adipiscing elit duis. Tortor dignissim
						convallis aenean et tortor at risus viverra. Sed lectus
						vestibulum mattis ullamcorper. Euismod in pellentesque
						massa placerat.
						<br />
						<br />
						Felis eget nunc lobortis mattis. Ut lectus arcu bibendum
						at varius vel. Nunc sed augue lacus viverra vitae
						congue. Eleifend mi in nulla posuere sollicitudin
						aliquam ultrices sagittis. Enim facilisis gravida neque
						convallis a cras semper auctor neque. Libero justo
						laoreet sit amet cursus sit amet. Vitae et leo duis ut
						diam. Vulputate ut pharetra sit amet aliquam. Nulla
						pellentesque dignissim enim sit. At varius vel pharetra
						vel.
					</Typography>
					<Button
						onClick={handleClose}
						sx={{
							position: 'absolute',
							right: 0,
							top: 0,
							width: '20px',
							height: '20px',
							minWidth: '20px',
							minHeight: '20px'
						}}
					>
						&times;
					</Button>
				</Box>
			</Box>
		</Modal>
	)
}
