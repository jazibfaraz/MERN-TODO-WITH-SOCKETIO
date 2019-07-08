const express = require('express');
const app = express();
const Todo = require('../mongoDB/index')


const getTodos = (io) => {

    Todo.find({}).then(response => {
        io.emit('getTodosToClient', response)
        // console.log(response);

    })

}

const manipulatedTodos = (io) => {
    Todo.find({}).then(todos => {
        io.emit('getManipulatedTodos', todos);
    })
}

const addTodos = (io, T) => {


    let todo = new Todo(T);
    todo.save((error, todos) => {
        if (error) {
            console.log('Todo failed to add');

        }
        else {
            io.emit('clientTodos', todos)

            console.log('todo added', todos);

        }
    });
}

const updateTodos = (io, T) => {

    Todo.updateOne({ id: T.id }, { $set: T }, (err, updatedTodo) => {
        if (err) console.error('Todo not updated!');
        else console.log('todo updated', updatedTodo);

        io.emit('changeData');

    })


}
const deleteTodos = (io, T) => {

    Todo.deleteOne({ id: T })
        .then(res => console.log('todo deleted', res)
        ).catch(err => console.error('todo not deleted', err)
        )



}

module.exports = { getTodos, addTodos, updateTodos, deleteTodos, manipulatedTodos }