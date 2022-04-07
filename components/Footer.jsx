import styles from './Footer.module.css'
import { Box, Link, Typography, useMediaQuery } from '@mui/material'
import { useLittera } from '@assembless/react-littera'

export default function Footer(){
	const sm = useMediaQuery('(max-width:768px)')

    return <Box 
        position={"relative"}
        width={"100%"}
        >
        <Box
            position={sm ? "initial" : "absolute"}
            left="10%"
            width={sm ? "100%" : "60%"}
            padding={sm ? "1em" : "1em 50% 1em 1em"}
            sx={{
                backgroundColor: "background.default"
            }}
            >
                <ul>
                    <li>Map</li>
                    <li>Login </li>
                    <li>Request Access</li>
                    <li>About</li>
                </ul>
                logos 
            </Box>

            <Box
                position={sm ? "initial" : "absolute"}
                left="40%"
                marginTop={sm ? "0" : "3em"}
                width={sm ? "100%" : "50%"}
                border={'1px solid white'}
                padding={"1em"}
                >
                    <Typography>
                    ContraSonic is a project of Senseable City Lab 
                    and the Center for Spatial Data Science in solidarity with Ukraine. 

                    Press Kit

                    Contributors: ...
                    </Typography>
                </Box>
        </Box>
    
}