import React, { useEffect, useRef } from "react";

export default function ExplainerVideoSection({
    currentStepIndex
}){
    const v1 = useRef(null)
    const v2 = useRef(null)
    const v3 = useRef(null)
    const v4 = useRef(null)
    const vids = [v1, v2, v3, v4]
    useEffect(() =>{
        if (currentStepIndex === 8) {
            vids.forEach(vid => vid.current.play())
        } else {
            vids.forEach(vid => vid.current.pause())
        }
    },[currentStepIndex])//eslint-disable-line
    
    return <div style={{
        position:'fixed',
        width:'100%',
        height:'100%',
        zIndex:0,
        left:0,
        top:0,
        pointerEvents:'none',
        transition:'250ms all',
        opacity: currentStepIndex > 6 && currentStepIndex < 9? 1 : 0
    }}>
    <video style={{
        position:'fixed',
        width:'320px',
        height:'180px',
        zIndex:0,
        left:'0%',
        top:'50%',
        background:'red',
        pointerEvents:'none',
    }} loop muted ref={v1}>
        <source src="/video/AURORA_SHORT.mp4" type="video/mp4" />
    </video>
        <video style={{
            position:'fixed',
            width:'640px',
            height:'360px',
            zIndex:0,
            left:'30%',
            bottom:'5%',
            background:'red',
            pointerEvents:'none',
        }} loop muted ref={v2}>
            <source src="/video/ADMIRAL_SHORT.mp4" type="video/mp4" />
        </video>
        <video style={{
            position:'fixed',
            width:'320px',
            height:'180px',
            zIndex:0,
            left:'22%',
            top:'5%',
            background:'red',
            pointerEvents:'none',
        }} loop muted ref={v3}>
            <source src="/video/NARYSHKIN_SHORT.mp4" type="video/mp4" />
        </video>
        <video style={{
            position:'fixed',
            width:'320px',
            height:'180px',
            zIndex:0,
            left:'75%',
            top:'75%',
            background:'red',
            pointerEvents:'none',
        }} loop muted ref={v4}>
            <source src="/video/PETROPAVLOVSKAYA_SHORT.mp4" type="video/mp4" />
        </video>
    </div>
}