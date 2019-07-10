import React from 'react';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table, Input, CustomInput } from 'reactstrap';

var socket;
var todoId;

class App extends React.Component {

  constructor() {
    super();

    this.state = {
      data: [],
      isDisabled: false,
      todoText: '',
    }

    this.addTodos = this.addTodos.bind(this);
    this.editTodos = this.editTodos.bind(this);
    this.updateTodos = this.updateTodos.bind(this);
    this.deleteTodos = this.deleteTodos.bind(this);
    this.renderTodosOnInitialState = this.renderTodosOnInitialState.bind(this);
    this.afterManipulationOfTodo = this.afterManipulationOfTodo.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);

    //eastablishing a connection on socket io
    // socket = io('http://localhost:4000');
    socket = io(window.location.hostname)
    socket.on('connect', () => console.log('connected')
    )

  }

  // renderTodosOnInitialState() function work is to render all the data to the client which exists in the db..!

  renderTodosOnInitialState() {
    socket.removeAllListeners();
    socket.emit('getTodos')
    socket.on('getTodosToClient', (todos) => {

      this.setState({ data: this.state.data.concat(...todos) })

      console.log(this.state.data);

    })
  }

  // componentDidMount() it will invoke the renderTodosOnInitialState().!
  componentDidMount() {
    this.renderTodosOnInitialState();
  }

  deleteTodos(id) {
    console.log(id);
    socket.emit('deleteTodos', id);
    socket.on('changeData', this.afterManipulationOfTodo())

  }

  // cancelEdit() this function is just enabling the submit btn again and clearing the input field
  cancelEdit() {
    const { isDisabled, todoText } = this.state;
    if (isDisabled === true) {
      this.todoInput.value = '';
      this.setState({ isDisabled: false });
    }
  }


  // afterManipulationOfTodo() this is just sending the req to get the updated todos from db
  afterManipulationOfTodo() {
    socket.emit('askManipulatedTodos');
    socket.on('getManipulatedTodos', (todos) => {
      console.log('after manipulation', ...todos);

      this.setState({ data: [...todos] })

    })
  }


  // updateTodos() is first getting the updated value from input field then send object
  // to update in db then refereshing the whole data also it is envoking the afterManipulationOfTodo()

  updateTodos() {


    console.log(this.todoInput.value, todoId);

    let todoObj = {
      id: todoId,
      todoBody: this.todoInput.value,
      status: true
    }
    socket.emit('updateTodos', todoObj)
    socket.on('changeData', this.afterManipulationOfTodo())

    this.todoInput.value = '';

    if (this.state.isDisabled == true) {
      this.setState({ isDisabled: false })
    }
  }

  // editTodos() is just taking the data from table and setting it to input field
  editTodos(id, tb) {

    console.log(this.todoInput);

    const { isDisabled } = this.state;
    if (isDisabled === false) {

      this.setState({ isDisabled: true })
    }

    console.log(id, tb);

    todoId = id;
    this.todoInput.value = tb;
    console.log('hogya');
  }

  // addTodos() functions work is to first get the total document count from db then
  // increment it by 1 for setting it to todoObj id because every time it should be
  // greater than the total documents exists in the db..!

  async addTodos() {

    var counts;
    socket.removeAllListeners()



    // Below is the code for fetching the total number of todos in the db

    socket.emit('askTodosCount');
    await socket.on('getTodosCount', (count) => {

      console.log('after getting total count of docs from db', count);

      counts = count;
      counts = counts + 1;
      console.log('after increment', counts);


      var todoObj = {
        id: counts,
        todoBody: this.todoInput.value,
        status: true
      }

      socket.emit('addTodos', todoObj);
      this.todoInput.value = '';
      socket.on('clientTodos', (todos) => {
        // console.log('after getting response', todos);

        // here i am concatenating the record which is returned when we add it to the db
        let arrTodo = [];
        arrTodo = todos;
        console.log(arrTodo);
        this.setState({ data: this.state.data.concat(arrTodo) })

        // console.log(...arrTodo);

      })

    })
  }


  render() {
    const { data, isDisabled } = this.state;
    return (

      <div className="App" >
        <div align="center">
          <input type="text" placeholder="write todo here" value={this.value} ref={e => this.todoInput = e} /><br /><br />
          <Button onClick={this.addTodos} color='success' ref={e => this.submitButton = e} disabled={isDisabled}>Submit</Button>
          <Button onClick={this.updateTodos} color='primary'>Update</Button>
          <Button onClick={this.cancelEdit} color='secondary'>Cancel</Button>
          <br /> <br />

        </div>

        <div>
          <Table striped hover>
            <thead>
              <tr scope='row'>
                <th>ID</th>
                <th>Todos</th>
                <th>Action</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>
              {
                data.map((todo, index) => {
                  return <tr key={index} scope='row'>
                    <td key={index}> {todo.id}</td>
                    <td>{todo.todoBody}</td>
                    <td><Button onClick={e => this.editTodos(todo.id, todo.todoBody)} color='primary'>Edit</Button></td>
                    <td><Button onClick={e => this.deleteTodos(todo.id)} color='danger'>Delete</Button></td>
                  </tr>
                })
              }
            </tbody>
          </Table>
        </div>

      </div>
    );
  }

}


export default App;
