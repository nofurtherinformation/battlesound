import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import styles from '../styles/Home.module.css'
import { Container, Box, Typography } from '@mui/material'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ExplainerMap from '../components/ExplainerMap'

const ExplainerTextSection = dynamic(
	() => import('../components/ExplainerTextSection'),
	{
		ssr: false
	}
)
const ExplainerVideoSection = dynamic(
	() => import('../components/ExplainerVideoSection'),
	{
		ssr: false
	}
)

export default function Home() {
	const [currentStepIndex, setCurrentStepIndex] = useState(null)
	const [currentStepProgress, setCurrentStepProgress] = useState(null)
	const onStepEnter = ({ data }) => setCurrentStepIndex(data)
	const onStepProgress = ({progress}) => setCurrentStepProgress(progress.toFixed(2))

	return (
		<div>
			<Head>
				<title>Sounds of Ukraine</title>
				<meta
					name="description"
					content="How can sound protect Ukraine's people from attack?"
				/>
			</Head>
			<Nav page="Methods" />
			{currentStepIndex > 0 && <ExplainerMap currentStepIndex={currentStepIndex} currentStepProgress={currentStepProgress} />}
			{currentStepIndex > 5 && <ExplainerVideoSection currentStepIndex={currentStepIndex} />}
			<ExplainerTextSection currentStepIndex={currentStepIndex} onStepEnter={onStepEnter} onStepProgress={onStepProgress}/>
			<Footer />
		</div>
	)
}
