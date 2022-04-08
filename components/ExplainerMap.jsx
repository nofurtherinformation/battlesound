import dynamic from 'next/dynamic'

const ExplainerMapInner = dynamic(() => import('./ExplainerMapInner'), {
	ssr: false
})

export default function ExplainerMap({
    currentStepIndex,
    currentStepProgress
}){
    if (currentStepIndex < 0 && currentStepIndex < 6) {
        return null
    } else {
        return <ExplainerMapInner currentStepIndex={currentStepIndex} currentStepProgress={currentStepProgress} baseStep={2} />
    }
}