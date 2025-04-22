const express = require('express')
const router = express.Router()

const wavEncoder = require('wav-encoder')
const fs = require('fs')

const DTMFfreqs = require('../DTMFdata.json') 
const  { generateDTMFTone, generateSilence } = require('../utils/DTMFhandler')

const baseRate = Number(process.env.BASERATE) || 44100
const pauseDuration = Number(process.env.PAUSEDURATION) || 0.3


// 主要邏輯:
router.post('/generator', async(req,res)=>{
    const { content } = req.body
    
    try{
        const checkPath = __dirname + `/../public/sounds/${content}.wav`
        if (fs.existsSync(checkPath)) {
            console.log('The sounds has already existed.')
            return res.redirect(`/${content}.wav`)
        }

        const generator = await generateDTMFSequence(content)
        if (generator){
            return res.redirect(`/${content}.wav`)
        } else {
            console.error(`Failed to redirect /${content}.wav`)
            return res.render('generator')
        }
    }catch(err){
        console.error('Error occupied on POST: /generator', err)
    }
})

router.get('/generator', (req,res) => res.render('generator'))

router.get('/', (req,res) => res.send('Welcome to express!'))

router.get('', (req, res) => res.redirect('/generator'))


async function generateDTMFSequence(digits){
    let audio = []

    for (const digit of digits){
        if (DTMFfreqs[digit]){
            audio = audio.concat(generateDTMFTone(digit))
            audio = audio.concat(generateSilence(pauseDuration))
        }
    }

    const audioData = {
        sampleRate: baseRate,
        channelData : [Float32Array.from(audio)]
    }
    const soundBuffer = await wavEncoder.encode(audioData)
    const filePath = __dirname + `/../public/sounds/${digits}.wav`
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