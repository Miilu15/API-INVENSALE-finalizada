const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const USERS_FILE = path.join(__dirname, '../database/users.json');

const register = async (req, res) => {

    const { username, password } = req.body;

    if (
        !username ||
        !password ||
        username.trim() === '' ||
        password.trim() === ''
    ) {
        return res.status(400).json({
            message: 'Todos los campos son obligatorios'
        });
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE));

    const userExists = users.find(user => user.username === username);

    if (userExists) {
        return res.status(400).json({
            message: 'El usuario ya existe'
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: Date.now(),
        username,
        password: hashedPassword
    };

    users.push(newUser);

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    res.status(201).json({
        message: 'Usuario registrado correctamente'
    });
};

const login = async (req, res) => {

    const { username, password } = req.body;

    if (
        !username ||
        !password ||
        username.trim() === '' ||
        password.trim() === ''
    ) {
        return res.status(400).json({
            message: 'Todos los campos son obligatorios'
        });
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE));

    const user = users.find(user => user.username === username);

    if (!user) {
        return res.status(401).json({
            message: 'Error en la autenticación'
        });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        return res.status(401).json({
            message: 'Error en la autenticación'
        });
    }

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username
        },
        'secretkey',
        {
            expiresIn: '1h'
        }
    );

    res.status(200).json({
        message: 'Autenticación satisfactoria',
        token
    });
};

module.exports = {
    register,
    login
};