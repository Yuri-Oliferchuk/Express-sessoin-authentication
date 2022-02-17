const express = require('express');
const session = require('express-session');
const api = express.Router();

const users = [
    {id:1, name:'Alex', email:'alex@gmail.com', password:'secret'},
    {id:2, name:'Yura', email:'yura@gmail.com', password:'secret'},
    {id:3, name:'Admin', email:'admin@gmail.com', password:'secret'}
]

const redirectLogin = (req, res, next) => {
    if(!req.session.userId) {
        res.redirect('/login');
    } else {
        next();
    }
}

const redirectHome = (req, res, next) => {
    if(req.session.userId) {
        res.redirect('/home');
    } else {
        next();
    }
}


api.get('/', (req, res) => {
    const {userId} = req.session;

    res.send(`
        <h1>Welcome!!!</h1>
        ${userId ? `
            <a href = '/home'>Home</a>
            <form method='post' action='/logout'>
                <button>Logout</button>
            </form>
            ` : `
            <a href = '/login'>Login</a>
            <a href = '/register'>Register</a>
        `}
    `)
});

api.get('/home', redirectLogin, (req, res) => {
    const user = users.find(
        user => user.id === req.session.userId
    )
    
    res.send(`
        <h1>Home</h1>
        <a href='/'>Main</a>
        <ul>
            <li>Name: ${user.name} </li>
            <li>Email: ${user.email} </li>
        </ul>
    `)
});

api.get('/login', redirectHome, (req, res) => {
    res.send(`
        <h1>Login</h1>
        <form method='post' action'/login'> 
            <input type='email' name='email' placeholder='Email' required />
            <input type='password' name='password' placeholder='Password' required />
            <input type='submit' />
        </form>
        <a href='/register'>Register</a>
    `)
});

api.get('/register', redirectHome, (req, res) => {
    res.send(`
        <h1>Register</h1>
        <form method='post' action'/register'> 
            <input type='name' name='name' placeholder='Name' required />
            <input type='email' name='email' placeholder='Email' required />
            <input type='password' name='password' placeholder='Password' required />
            <input type='submit' />
        </form>
        <a href='/login'>Login</a>
    `)
});

api.post('/login', redirectHome, (req, res) => {
    const {email, password} = req.body;

    if(email&&password) {
        const user = users.find(
            user => user.email === email && user.password === password
        )

        if(user) {
            req.session.userId = user.id;
            return res.redirect('/home');
        }
    }
    return res.redirect('/login');
});

api.post('/register', redirectHome, (req, res) => {
    const {name, email, password} = req.body;

    if (name&&email&&password) {
        const exist = users.some(
            user => user.email === email
        )

        if (!exist) {
            const user = {
                id: users.length + 1,
                name: name,
                email: email,
                password: password,
            };
            users.push(user);
            req.session.userId = user.id;
            return res.redirect('/home')
        }
    }
    return res.redirect('/register'); // if any errors
});

api.post('/logout', redirectLogin, (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return res.redirect('/home');
        }

        res.clearCookie(session.name);
        res.redirect('/login');
    })
});

module.exports = api;