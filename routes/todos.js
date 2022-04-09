const {Router} = require('express')
const router = Router()
const Todo = require('../models/Todo')
const User = require('../models/User')
session = require('express-session');
const auth = require('../middleware/auth.middleware')
const config = require('config')

// api/todos/
router.get('/', auth, async (req,res) => {
    try {
        const todos = await Todo.find({user: req.user.userId})
        res.json(todos)
    } catch(e) {
        res.status(500).json({message: "Что-то пошло не так, попробуйте снова "})
    }
})

// router.get('/create', (req,res) => {
//     res.render('create', {
//         title: 'Create student',
//         isCreate: true
//     })
// })

// router.get('/read', (req,res) => {
//         res.render('read', {
//         title: 'Read student',
//         isRead: true
//     })
// })

// router.get('/update', (req,res) => {
//     res.render('update', {
//         title: 'Update todos',
//         isUpdate: true
//     })
// })

// api/todos/completed
router.post('/completed', auth, async (req,res) => {
    try {
        const id = req.body.id
        const todo = await Todo.findById(id)
        todo.completed = !todo.completed
        await todo.save()
        if(todo.completed) {
            res.status(201).json({message: "Задача выполнена!"})
        } else {
            res.status(201).json({message: "Задача  НЕ выполнена!"})
        }
    } catch (e) {
        res.status(500).json({message: "Что-то пошло не так, попробуйте снова "})
    }
})

// api/todos/create
router.post('/create', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl')
        const name = req.body.name
        const description = req.body.description

        const todo = new Todo({
            name: name, description: description, completed: false, user: req.user.userId
        })
        await todo.save()
        res.status(201).json({message: "Добавлено"})

    } catch(e) {
        res.status(500).json({message: "Что-то пошло не так, попробуйте снова "})
    }

})

// api/todos/delete
router.post('/delete', auth, async (req,res) => {
    const id = req.body.id
    const user = req.user.userId
    console.log(req.user)
    console.log(id)
    const todo = await Todo.findById(id)
    if(todo.user === user) {
        const f = await Todo.remove({_id: id})
        todo.save()
        res.status(200).json({message: "Удалено"})
    } else {
        res.status(403).json({message: "Вы не имеете права"})
    }
})

router.get('/:id', auth, async (req,res) => {
    try {
        const todo = await Todo.findById(req.params.id)
        res.json(todo)
    } catch(e) {
        res.status(500).json({message: "Что-то пошло не так, попробуйте снова "})
    }
})

router.post('/update', auth, async(req,res) => {
    try {
        const id = req.body.id

        const name = req.body.newName
        const description = req.body.newDes
    
        const data = {_id: id, name: name, description: description}

        const todo = await Todo.findById(id)
        console.log('Начальная тудушка', todo)
        console.log('Новые данные', data)

        if(data.name == '') {
            return res.status(400).json({message: "Задача не может иметь пустое название"})
        }

        Todo.updateOne({_id: {$eq: id}}, data, (err) => {
            if (err) {
                console.log(err)
            } else {
                //res.json(todo);
            }
        })
        todo.save()

        const ntodo = await Todo.findById(id)
        console.log('Измененная тудушка', ntodo)
        res.status(200).json({message: "Изменено"})
    } catch(e) {
        res.status(500).json({message: "Что-то пошло не так, попробуйте снова "})
    }
})

module.exports = router