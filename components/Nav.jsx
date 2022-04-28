import React, { useEffect } from 'react'
import { useLittera, useLitteraMethods } from '@assembless/react-littera'
import { Link, Box, Button, ButtonGroup } from '@mui/material'
import useLocalStorage from '../hooks/useLocalStorage'

const translations = {
	Map: {
		en_US: 'Map',
		zh_CN: '地图',
		ru_RU: 'Карта',
		uk_UA: 'Карта'
	},
	Methods: {
		en_US: 'Methods',
		zh_CN: '首页',
		ru_RU: 'Главная',
		uk_UA: 'Головна'
	},
	About: {
		en_US: 'About',
		zh_CN: '关于',
		ru_RU: 'О нас',
		uk_UA: 'Про нас'
	},
	// Login: {
	// 	en_US: 'Login',
	// 	zh_CN: '登录',
	// 	ru_RU: 'Вход',
	// 	uk_UA: 'Вхід'
	// }
}

const links = [
	{
		href: '/',
		text: 'Map'
	},
	{
		href: '/methods',
		text: 'Methods'
	},
	{
		href: '/login',
		text: 'Login'
	},
	{
		href: '/about',
		text: 'About'
	}
]

const TextLinks = ({ links, page }) => {
	const translated = useLittera(translations)
	return (
		<span>
			{links.map(({ href, text }) => (
				<Link
					href={href}
					color={page === text ? 'secondary.main' : 'primary.main'}
					underline="none"
					paddingRight="1em"
					key={text}
				>
					{translated[text]}
				</Link>
			))}
		</span>
	)
}

const translationOptions = [
	{ label: 'EN', value: 'en_US' },
	{ label: 'UA', value: 'uk_UA' },
	{ label: 'RU', value: 'ru_RU' }
]

const TranslationButtons = () => {
	const [locale, setLocale] = useLocalStorage('persisted_locale', 'en_US')
	const methods = useLitteraMethods()
	const handleLocaleChange = (value) => {
		setLocale(value)
		methods.setLocale(value)
	}
	useEffect(() => {
		methods.setLocale(locale)
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<ButtonGroup variant="text">
			{translationOptions.map(({ label, value }) => (
				<Button
					onClick={() => handleLocaleChange(value)}
					variant="text"
					color={methods.locale === value ? 'secondary' : 'primary'}
					key={value}
				>
					{label}
				</Button>
			))}
		</ButtonGroup>
	)
}

export default function Nav({ page = '' }) {
	return (
		<Box
			sx={{
				maxWidth: '100vw',
				backgroundColor: 'background.default',
				borderWidth: 1,
				borderRight: 0,
				borderTop: 0,
				borderColor: 'primary.main',
				borderStyle: 'solid',
				position: 'fixed',
				top: 0,
				right: 0,
				padding: '1em',
				zIndex: 1
			}}
		>
			<nav>
				<TextLinks links={links} page={page} />
				<TranslationButtons />
			</nav>
		</Box>
	)
}
