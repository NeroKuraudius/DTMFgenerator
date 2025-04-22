if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const exphbs = require('express-handlebars')

const port = process.env.PORT || 3001
const app = express()

const routes = require('./routes')

app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main'}))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public/sounds'))

app.use('/', routes)

app.listen(port, ()=>{
    console.log(`App starts listening at port: ${port}`)
})