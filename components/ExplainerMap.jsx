import dynamic from 'next/dynamic'

const ExplainerMapInner = dynamic(() => import('./ExplainerMapInner'), {
	ssr: false
})

export default function ExplainerMap({
    currentStepIndex,
    currentStepProgress
}){
    return <ExplainerMapInner currentStepIndex={currentStepIndex} currentStepProgress={currentStepProgress} baseStep={2} />
}