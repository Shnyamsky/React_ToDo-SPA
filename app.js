const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const passport = require('passport')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const config= require('config')

const PORT = process.env.PORT || 5000

const app = express()
app.use(express.json({extended: true}))
//const hbs = exphbs.create({
    //defaultLayout: 'main',
    //extname: 'hbs'
//})

//app.engine('hbs', hbs.engine)
//app.set('view engine', 'hbs')
//app.set('views', 'views')

//app.use(express.urlencoded({extended: true}))
//app.use(express.static(path.join(__dirname, 'public')))


var sessionMiddleware = session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ 
        url: '<paste your MongoDB URL>'
    })
  });
app.use(sessionMiddleware);

//require('./middleware/passport')(passport)

app.use('/api/todos', require('./routes/todos'))
app.use('/api/auth', require('./routes/auth.routes'))

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => {
            console.log('Server has been started on', PORT, 'PORT...')
        })
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()

