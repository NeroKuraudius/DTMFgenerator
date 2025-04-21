const express = require('express')
const router = express.Router()

router.get('/', (req,res)=>{
    return res.render('Welcome to express!')
})

module.exports = router