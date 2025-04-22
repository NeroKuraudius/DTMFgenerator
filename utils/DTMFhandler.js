const DTMFfreqs = require('../DTMFdata.json')
const tone = require('tonegenerator')


const baseRate = Number(process.env.BASERATE) || 44100
const toneDuration = Number(process.env.TONEDURATION) || 0.5

function generateDTMFTone(digit) {
    const [t1, t2] = DTMFfreqs[digit]
    const lowTone = tone(t1, toneDuration, baseRate)
    const highTone = tone(t2, toneDuration, baseRate)
    const mixed = lowTone.map((t, i) => (t + highTone[i]) * 0.5)
    return mixed;
}

function generateSilence(duration) {
    const silence = Math.floor(baseRate * duration)
    return new Array(silence).fill(0)
}

module.exports = { generateDTMFTone, generateSilence }