const express = require('express')
const router = express.Router()

const baseRate = process.env.BASERATE || 44100
const pauseDuration = process.env.PAUSEDURATION || 0.1
const DTMFfreqs = require('../DTMFdata.json') 
const  { generateDTMFTone, generateSilence } = require('../utils/DTMFhandler')
const wavEncoder = require('wav-encoder')
const fs = require('fs')

router.get('/', (req,res)=>{
    return res.send('Welcome to express!')
})

router.get('/generator', (req,res)=>{
    return res.render('generator')
})


// 主要邏輯:
router.post('/generator', async(req,res)=>{
    const { content } = req.body
    
    try{
        const checkPath = `../public/sounds/${content}.wav`
        if (fs.existsSync(checkPath)){
            console.log('The sounds has already existed.')
            return res.redirect(`${content}.wav`)
        }

        const generator = await generateDTMFSequence(DTMFfreqs, content)
        
    }catch(err){
        console.error('Error occupied on POST: /generator', err)
    }
})

async function generateDTMFSequence(digits, filename){
    let audio = []

    for (const digit of digits){
        if (DTMFfreqs[digit]){
            audio = audio.concat(generateDTMFTone(digit))
            audio = audio.concat(generateSilence(pauseDuration))
        }
    }

    const audioData = {
        baseRate,
        channelData : [Float32Array.from(audio)]
    }
    const soundBuffer = await wavEncoder.encode(audioData)
    const filePath = `../public/sounds/${filename}.wav`
    fs.writeFileSync(filePath, Buffer.from(soundBuffer))
    if (fs.existsSync(filePath)){
        console.log('Sound file saved sucessfully!')
        return 1
    }else{
        console.error('Failed to save sounds file.')
        return 0
    }
}

module.exports = router