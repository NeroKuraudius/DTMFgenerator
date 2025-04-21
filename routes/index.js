const express = require('express')
const router = express.Router()

router.get('/', (req,res)=>{
    return res.send('Welcome to express!')
})

router.get('/generator', (req,res)=>{
    return res.render('generator')
})

module.exports = router