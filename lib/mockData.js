const fs = require('fs')
const papa = require('papaparse')

const types = [
    "SHELLING",
    "GUNFIRE",
    "SIREN"
]

const [minX, minY, maxX, maxY] = [30.075223,50.314195,31.009061,50.622752]
const [xRange,yRange] = [maxX-minX, maxY-minY]
const [minRadius, maxRadius] = [50, 1500]
const radiusRange = maxRadius-minRadius

const generateData = () => {
    let day = new Date()
    let data = []
    for (let i=0; i<7; i++){
        for (let j=0; j<24; j++){
            let x = Math.random()*xRange+minX
            let y = Math.random()*yRange+minY
            let type = types[Math.floor(Math.random()*types.length)]
            let time = day.toISOString()
            let radius = Math.random()*radiusRange+minRadius
            data.push({x,y,type,radius,time})
            day.setHours(j)
        }
        day.setDate(day.getDate()-i)
    }
    return data
}

const data = generateData()
const csvData = papa.unparse(data)
fs.writeFileSync('./public/data/mockData.csv', papa.unparse(data))