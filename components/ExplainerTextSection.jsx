import { Scrollama, Step } from 'react-scrollama'
import { ExplainerTextBox, ExplainerTextContainer } from './ExplainerTextBox'
import { Link, Typography, useMediaQuery } from '@mui/material'
import { useLittera } from '@assembless/react-littera'
import Image from 'next/image'
import styles from './ExplainerTextSection.module.css'

const BoxLink = ({ href, children }) => {
	return (
		<Link href={href}>
			<Typography
				style={{
					padding: '5px',
					background: '#FFD500',
					color: 'black',
					textTransform: 'none',
					display: 'block',
					width: 'fit-content',
					blockSize: 'fit-content',
					marginBottom: '1em'
				}}
			>
				{children}
			</Typography>
		</Link>
	)
}
const translations = {
	Battle: {
		en_US: 'Battle',
		zh_CN: '战斗',
		ru_RU: 'Битва',
		uk_UA: 'Битва'
	},
	Sound: {
		en_US: 'Sound',
		zh_CN: '声音',
		ru_RU: 'Звук',
		uk_UA: 'Звук'
	},
	SplashPage: {
		en_US: 'The sounds of Ukraine can identify attacks,  help protect refugee efforts & people sheltering in place.',
		zh_CN: '英国的音乐可以识别攻击，帮助保护流浪人的行动，并且可以提供在场的人们的安全。',
		ru_RU: 'Звуки Украины могут определить атаки, помогать защитить прохождение обороны и людей, которые находятся в положении.',
		uk_UA: 'Звуки України можуть визначати атаки, допомогти захисту експериментів про переселення i людей, що знаходяться в місці.'
	},
	Motivation1: {
		en_US: "To aid Ukraine's citizens in the war, we need to know what happens in Ukraine's cities.",
		zh_CN: '为了帮助英国人民在战争中，我们需要知道英国城市的情况。',
		ru_RU: 'Для помощи граждан Украины в войне, мы должны знать, что происходит в городах Украины.',
		uk_UA: 'Для допомоги громадян України в війні, ми повинні знати, що відбувається в містах України.'
	},
	Motivation2: {
		en_US: 'But our knowledge of events on the street are incomplete. So, we must find ways to learn more.',
		zh_CN: '但我们的街道上的事件知识不完整。所以，我们必须找到一些方法来学习更多。',
		ru_RU: 'Но наше знание событий на улице неполное. Поэтому мы должны найти способытия, чтобы узнать больше.',
		uk_UA: 'Але наша знання про події на вулиці неповні. Тому ми повинні знайти способи, щоб дізнатися більше.'
	},
	Method1: {
		en_US: 'To do this, we can listen to the city, events on the ground, & sounds traveling through the streets.',
		zh_CN: '我们可以听城市，地面上的事件，和街道上的声音。',
		ru_RU: 'Чтобы это сделать, мы можем слушать город, события на земле, и звуки, которые передвигаются по улицам.',
		uk_UA: 'Щоб це робити, ми можемо слухати місто, події на землі, i звуки, що передвигаються по вулицях.'
	},
	Method2: {
		en_US: 'We worked with volunteers to place mobile phones on the top buildings in Kyiv.',
		zh_CN: '我们与志愿者一起在基辅城市的顶部建筑上放置手机。',
		ru_RU: 'Мы работали с волонтерами, чтобы разместить мобильные телефоны на верхних строениях в Киеве.',
		uk_UA: 'Ми працювали з волонтерами, щоб помістити мобільні телефони на верхніх будинках в Києві.'
	},
	Method3: {
		en_US: 'When a shell or bomb hits in the city, shots are fired, or sirens blare, each phone hears the sound at a slightly different time.',
		zh_CN: '当城市上的炮弹或炸弹击中时，射击被发射，或者警报响起时，每个手机都会听到不同的声音。',
		ru_RU: 'Когда в городе попадает бомба или снаряд, выстрелы выстреляются, или будильники звенят, каждый телефон слышит этот звук с небольшим интервалом.',
		uk_UA: 'Коли в місті попадає бомба чи снаряд, вистріли вистріляються, або будильники звенять, кожен телефон записує цей звук з невеликим інтервалом.'
	},
	Method4: {
		en_US: 'By calculating the time delay, we can locate the source of the sound. Using machine learning, we can identify what type of sound occured.',
		zh_CN: '通过计算延迟时间，我们可以定位声音的来源。使用机器学习，我们可以识别出声音的类型。',
		ru_RU: 'Путем расчета времени задержки, мы можем определить источник этого звука. Используя машинное обучение, мы можем определить, что тип звука произошел.',
		uk_UA: 'Починаючи з розрахунку часу затримки, ми можемо визначити джерело цього звуку. Використовуючи машинне обучення, ми можемо визначити, що тип звуку произошев.'
	},
	Onboarding: {
		en_US: 'Explore detections on the map from 4/2/2022. For real-time data users, log in below.',
		zh_CN: '从4月2日至4月6日查看在地图上的检测。对于实时数据用户，请登录。',
		ru_RU: 'Просмотреть обнаружения на карте от 4 апреля 2022 года. Для реального времени пользователей, войдите ниже.',
		uk_UA: 'Дивіться виявлення на мапі від 4 квітня 2022 року. Для реального часу користувачів, входіть нижче.'
	},
	Explore: {
		en_US: 'Explore the map',
		zh_CN: '查看地图',
		ru_RU: 'Посмотреть карту',
		uk_UA: 'Дивитися мапу'
	},
	Login: {
		en_US: 'Log in for real-time data',
		zh_CN: '登录以查看实时数据',
		ru_RU: 'Войдите для реального времени',
		uk_UA: 'Вхід для реального часу'
	},
	Request: {
		en_US: 'Request real-time access',
		zh_CN: '申请实时数据',
		ru_RU: 'Запросить реальное время',
		uk_UA: 'Запит на реальний час'
	},
	About: {
		en_US: 'About',
		zh_CN: '关于',
		ru_RU: 'О нас',
		uk_UA: 'Про нас'
	},
	Contact: {
		en_US: 'Contact',
		zh_CN: '联系我们',
		ru_RU: 'Связаться',
		uk_UA: "Зв'язатися"
	}
}

export default function ExplainerTextSection({
	currentStepIndex,
	onStepEnter = () => {}
}) {
	// sizing breakpoints
	const sm = useMediaQuery('(max-width:768px)')
	const md = useMediaQuery('(min-width:768px) and (max-width:1440px)')
	const lg = useMediaQuery('(min-width:1440px)')
	const currSize = sm ? 'sm' : md ? 'md' : lg ? 'lg' : 'sm'

	const translated = useLittera(translations)
	const frames = [
		[
			{
				position: {
					md: {
						left: '-1px',
						top: '20%'
					},
					lg: {
						left: '-1px',
						top: '20%'
					}
				},
				border: true,
				padding: '2em',
				content: (
					<Typography variant="h1" color="primary">
						<span style={{ color: '#FFD500' }}>
							{translated.Battle}
						</span>
						<br />
						{translated.Sound}
					</Typography>
				)
			},
			{
				position: {
					md: {
						right: '0',
						top: '45%',
						width: '58%'
					},
					lg: {
						right: '0',
						top: '45%',
						width: '58%'
					}
				},
				border: true,
				content: (
					<Typography variant="h2" color="primary">
						{translated.SplashPage}
					</Typography>
				)
			}
		],
		[
			{
				position: {
					sm: {
						aspectRatio: '1.5'
					},
					md: {
						right: '0',
						top: '30%',
						width: '40%',
						minHeight: '300px',
						aspectRatio: '1.5'
					},
					lg: {
						right: '10%',
						top: '30%',
						width: '50%',
						minHeight: '300px',
						aspectRatio: '1.5'
					}
				},
				border: false,
				padding: 0,
				content: (
					<Image
						src={'/img/AP22072771666802.jpeg'}
						layout="fill"
						alt="Alt text here"
					/>
				)
			},
			{
				position: {
					md: {
						left: '0',
						top: '45%',
						width: '65%'
					},
					lg: {
						left: '10%',
						top: '45%',
						width: '50%'
					}
				},
				border: true,
				content: (
					<Typography variant="h2" color="primary">
						{translated.Motivation1}
					</Typography>
				)
			}
		],
		[
			{
				position: {
					sm: {
						aspectRatio: '1.5'
					},
					md: {
						left: '0',
						top: '20%',
						width: '40%',
						minHeight: '300px',
						aspectRatio: '1.5'
					},
					lg: {
						left: '10%',
						top: '20%',
						width: '50%',
						minHeight: '300px',
						aspectRatio: '1.5'
					}
				},
				border: false,
				padding: 0,
				content: (
					<Image
						src={'/img/AP22060795547794.jpeg'}
						layout="fill"
						alt="Alt text here"
					/>
				)
			},
			{
				position: {
					md: {
						left: '50%',
						top: '45%',
						width: '50%'
					},
					lg: {
						left: '50%',
						top: '45%',
						width: '50%'
					}
				},
				border: true,
				content: (
					<Typography variant="h2" color="primary">
						{translated.Motivation2}
					</Typography>
				)
			}
		],
		[
			{
				position: {
					md: {
						left: '0',
						top: '10%',
						width: '50%'
					},
					lg: {
						left: '10%',
						top: '15%',
						width: '50%'
					}
				},
				border: true,
				content: (
					<Typography variant="h2" color="primary">
						{translated.Method1}
					</Typography>
				)
			}
		],
		[
			{
				position: {
					md: {
						left: '0',
						top: '10%',
						width: '50%'
					},
					lg: {
						left: '10%',
						top: '15%',
						width: '50%'
					}
				},
				border: true,
				content: (
					<Typography variant="h2" color="primary">
						{translated.Method2}
					</Typography>
				)
			}
		],
		[
			{
				position: {
					md: {
						left: '0',
						top: '10%',
						width: '50%'
					},
					lg: {
						left: '10%',
						top: '15%',
						width: '50%'
					}
				},
				border: true,
				content: (
					<Typography variant="h2" color="primary">
						{translated.Method3}
					</Typography>
				)
			}
		],
		[
			{
				position: {
					md: {
						left: '0',
						top: '10%',
						width: '50%'
					},
					lg: {
						left: '10%',
						top: '15%',
						width: '50%'
					}
				},
				border: true,
				content: (
					<Typography variant="h2" color="primary">
						{translated.Method4}
					</Typography>
				)
			}
		],
		[
			{
				position: {
					md: {
						left: '0',
						top: '10%',
						width: '50%'
					},
					lg: {
						left: '10%',
						top: '15%',
						width: '50%'
					}
				},
				border: true,
				content: (
					<Typography variant="h2" color="primary">
						{translated.Onboarding}
					</Typography>
				)
			},
			{
				position: {
					md: {
						left: '0',
						top: '50%',
						width: '100%'
					},
					lg: {
						left: '10%',
						top: '50%',
						width: '100%'
					}
				},
				border: false,
				content: (
					<div>
						<BoxLink href="/map">Explore the map</BoxLink>
						<BoxLink href="/login">
							Login for real-time data
						</BoxLink>
						<BoxLink href="/request">
							Request realtime access
						</BoxLink>
						<BoxLink href="/about">About</BoxLink>
					</div>
				)
			}
		]
	]

	return (
		<section className={styles.scrollContainer}>
			<Scrollama offset={.75} onStepEnter={onStepEnter}>
				{frames.map((boxes, frameIdx) => (
					<Step data={frameIdx} key={frameIdx}>
						<div
							style={{
								minHeight: '100vh',
								position: 'relative',
								paddingBottom: '20vh'
							}}
						>
							{boxes.map(
								(
									{ position, border, padding, content },
									idx
								) => (
									<ExplainerTextBox
										position={position[currSize]}
										border={border}
										padding={padding}
										singleCol={sm}
										key={idx}
									>
										{content}
									</ExplainerTextBox>
								)
							)}
						</div>
					</Step>
				))}
			</Scrollama>
		</section>
	)
}
