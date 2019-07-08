const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/Jazib';
const cloudUri = 'mongodb://mydb:mydb12345@ds243317.mlab.com:43317/todo'

mongoose.connect(cloudUri, { useNewUrlParser: true })
    .then(res => console.log('mongoDB connected !')
    ).catch(err => console.error('mongoDB connection error !')
    )

const schema = new mongoose.Schema({
    id: Number,
    todoBody: String,
    status: Boolean,
    date: {
        type: Date,
        default: Date.now
    }
});

const Todo = mongoose.model('socketTodo', schema);

module.exports = Todo;