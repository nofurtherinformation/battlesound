import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import styles from '../styles/Home.module.css'
import { Container, Box, Typography } from '@mui/material'
import Nav from '../components/Nav'

const ExplainerTextSection = dynamic(
	() => import('../components/ExplainerTextSection'),
	{
		ssr: false
	}
)

export default function Home() {
	const [currentStepIndex, setCurrentStepIndex] = useState(null)
  
	const onStepEnter = ({ data }) => {
    console.log(data)
		setCurrentStepIndex(data)
	}

	return (
		<div className={styles.container}>
			<Head>
				<title>Create Next App</title>
				<meta
					name="description"
					content="Generated by create next app"
				/>
				<link rel="icon" href="/favicon.ico" />
				<link
					href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400;700&display=swap"
					rel="stylesheet"
				/>
			</Head>
			<Nav page="Home" />
			<ExplainerTextSection currentStepIndex={currentStepIndex} onStepEnter={onStepEnter} />
		</div>
	)
}
