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

export default function Home() {
	const [currentStepIndex, setCurrentStepIndex] = useState(null)
	const [currentStepProgress, setCurrentStepProgress] = useState(null)
	const onStepEnter = ({ data }) => setCurrentStepIndex(data)
	const onStepProgress = ({progress}) => setCurrentStepProgress(progress.toFixed(2))

	return (
		<div>
			<Head>
				<title>BattleSound</title>
				<meta
					name="description"
					content="How can sound protect Ukraine's people from attack?"
				/>
			</Head>
			<Nav page="Home" />
			{currentStepIndex > 1 && <ExplainerMap currentStepIndex={currentStepIndex} currentStepProgress={currentStepProgress} />}
			<ExplainerTextSection currentStepIndex={currentStepIndex} onStepEnter={onStepEnter} onStepProgress={onStepProgress}/>
			<Footer />
		</div>
	)
}
