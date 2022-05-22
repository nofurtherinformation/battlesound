import React, { useEffect } from 'react'
import ReactAudioPlayer from 'react-audio-player'
import useSound from 'use-sound';
import {
    Box
} from '@mui/material'

const defaultPlaceholder = "/audio/placeholder.wav"
export const AudioPlayer = ({ currentObject, muted }) => {
    const track = currentObject?.file || defaultPlaceholder
    const [play] = useSound(track);
    useEffect(() => {
        if (currentObject && !muted) {
            play()
        }
    },[track]) //eslint-disable-line react-hooks/exhaustive-deps
	return <Box sx={{position:'fixed', bottom:0, left:'50%'}}>
    </Box>
}
