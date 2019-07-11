// const io = require('socket.io')();
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
let socket = require('socket.io');
const Todo = require('../mongoDB/index')
const todoController = require('../express/server')

const server = app.listen(port, () => console.log('server is listening on port: ' + port)
)

const io = socket(server);

if (port === 'development') {
    server = 'http://localhost:4000';
}

io.on('connection', (socket) => {
    console.log('connection eastablished', socket.id)

    socket.on('addTodos', (T) => {
        console.log(T);

        todoController.addTodos(io, T);
    })

    socket.on('askTodosCount', () => {
        const count = Todo.estimatedDocumentCount({})
            .then(count => socket.emit('getTodosCount', count)
            )
            .catch(err => console.error(err)
            )

    })

    socket.on('getTodos', () => {

        todoController.getTodos(io);
    })

    socket.on('askManipulatedTodos', () => {
        todoController.manipulatedTodos(io);
    })
    socket.on('updateTodos', (T) => {

        todoController.updateTodos(io, T);
    })

    socket.on('deleteTodos', (T) => {
        todoController.deleteTodos(io, T);
    })

})

