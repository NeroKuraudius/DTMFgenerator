const express = require('express')
const router = express.Router()

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
        const 
    }catch(err){
        console.error('Error occupied on POST: /generator', err)
    }
})

module.exports = router