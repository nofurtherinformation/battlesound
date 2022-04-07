import Image from "next/image";

const imagePaths = {
    "3": "/img/explainer-map/1.png",
    "4": "/img/explainer-map/2.png",
    "5": "/img/explainer-map/3.png",
    "6": "/img/explainer-map/4.png",
}

export default function ExplainerMapInner({
    currentStepIndex,
}){
    if (!imagePaths[currentStepIndex]) {
        return null
    }
    return <div style={{width:"100%", height:"100%", position:"fixed", inset:0, zIndex:0}}>
        <Image src={imagePaths[currentStepIndex]} layout="fill" />
    </div>
}