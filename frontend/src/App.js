import React, { Component } from 'react';
import axios from 'axios';
import "./App.css"

class App extends Component {
  state = {
    todoList:[],
    activeItem:{
      id:null,
      title:'',
      completed:false
    },
    editing:false
  }

  componentDidMount() {
    this.fetchTask()
  }

  fetchTask = () => {
    console.log("fetching")
    fetch('http://localhost:8000/api/task-list/')
    .then(response => response.json())
    .then(data => (
      console.log(data),
      this.setState({
        todoList:data
      })
    ))
  }

  onChange = (e) => {
    console.log(e.target.value)
    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:e.target.value
      }
    })
  }

  onSubmit = (e) => {
    e.preventDefault()
    console.log(this.state.activeItem)

    var url = 'http://localhost:8000/api/task-create/'

    if (this.state.editing === true) {
      url = `http://localhost:8000/api/task-update/${this.state.activeItem.id}/`
    }

    axios({
      method:'post',
      url:url,
      data:this.state.activeItem
    })
    .then((response) => {
      this.fetchTask()
      this.setState({activeItem:{id:null, title:'',completed:false},})
      
      console.log(this.state.activeItem)
    })
  }

  handleEdit = (todo) => {
    console.log(todo)
    this.setState({
      activeItem:{id:todo.id, title:todo.title, completed:todo.completed},
      editing:true})

  }

  handleDelete = (todo) => {
    console.log(todo)
    axios.delete(`http://localhost:8000/api/task-delete/${todo.id}/`)
    .then((response) => this.fetchTask())
  }

  strikeUnstrike = (todo) => {
    todo.completed = !todo.completed
    console.log(todo)
    axios({
      method:'post',
      url:`http://localhost:8000/api/task-update/${todo.id}/`,
      data:{'completed':todo.completed, 'title':todo.title}
    })
    .then(response => this.fetchTask())

    
  }

  render() { 
    return ( 
      <div className='container'>
          <div id='task-container'>
            <div id='form-wrapper'>
              <form id='form' onSubmit={this.onSubmit}>
                <div className='flex-wrapper'>
                  <div style={{flex: 6}}>
                    <input onChange={this.onChange} className='form-control' id='title' type='text' name='title' value={this.state.activeItem.title} placeholder='Add todos'/>
                  </div>

                  <div style={{flex: 1}}>
                    <input id='submit' className='btn btn-warning' type='submit' name='add'/>
                  </div>
                </div>
              </form>
            </div>
            
            <div id='list-wrapper flex-wrapper'>
              {this.state.todoList.map((todo, index) => (
                <div key={index} className='task-wrapper flex-wrapper'>

                  <div style={{flex:7}} onClick={()=>this.strikeUnstrike(todo)}>
                    {todo.completed == true ? (
                      <strike>{todo.title}</strike>
                    ) : (
                      <span>{todo.title}</span>
                    )}
                  </div>

                  <div style={{flex:1}}>
                    <button id={todo.id} onClick={()=>this.handleEdit(todo)} className='btn btn-sm btn-outline-info'>Edit</button>
                  </div>

                  <div style={{flex:1}}>
                    <button onClick={()=>this.handleDelete(todo)} className='btn btn-sm btn-outline-danger delete'>X</button>
                  </div>
                 
                </div>
              ))}
            </div>
         
          </div>
      </div>
     );
  }
}
 
export default App;