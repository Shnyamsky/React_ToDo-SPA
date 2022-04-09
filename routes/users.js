const {Router} = require('express')
const router = Router()
const User = require('../models/User')
//const keys = require('../config/keys')
const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken')
 

checkUser = function(userData) {
    return User
    .findOne({email: userData.email})
    .then(function(user){
        const passwordResult = bcrypt.compareSync(userData.password, user.password)
        if ( passwordResult ) {
            console.log("User password is ok");
            return Promise.resolve(user)
    } else {
        return Promise.reject("Error wrong")
    }
    })
   }

router.post('/login', (req, res, next) => {
    
    //const candidate = await User.findOne({email: req.body.email})
    
    checkUser(req.body)
        .then(function(user){
            if(user) {
                console.log('tesrt')
                req.session.user = {id: user._id, email: user.email}
                
                console.log(req.session.user)
                res.redirect('/')
            } else {
                return next(error)
                }
            }).catch(function(error){
                return next(error)
 })
})

router.post('/register', async (req,res) => {
    const candidate = await User.findOne({email: req.body.email})
    if(candidate) {
        res.status(409).json({
            message: 'This email is exist! Try to another email'
        })
    } else {
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password,salt)
       })
       try {
           await user.save()
           res.redirect('/login')
       } catch(e) {
           //TODO error
       }
    }
    
})
router.post('/logout', function(req, res, next) {
    if (req.session.user) {
    delete req.session.user;
    res.redirect('/login')
    }
})


router.get('/register', (req,res) => {
    res.render('registration', {
        title: 'Registrrr'
    })
})

router.get('/login', (req,res) => {
    res.render('login', {
        title: 'Log in'
    })
})

module.exports = router