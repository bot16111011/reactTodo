import React, { useState, useEffect } from 'react';
import "./todo.scss";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

export const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
      .then(response => response.json())
      .then(data => {
        setTodos(data);
      })
      .catch(error => {
        console.error('Error fetching todos: ', error);
      });
  }, []);

  const addTodo = async () => {
    if (newTodo.trim() === '') {
      return;
    }

    const newTask = {
      idm: uuidv4(),
      title: newTodo,
      completed: false
    };

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(newTask),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const addedTask = await response.json();
      setTodos((prevTodos) => [...prevTodos, addedTask]);
      setNewTodo('');
      toast.success('Task added successfully');
    } catch (error) {
      console.log('Error adding task:', error);
      toast.error('Error adding task');
    }
  };
 

  const updateTodo = async (id, updatedTodo) => {
    if (id > 200) {
      const updatedTodos = todos.map(todo => (todo.idm === updatedTodo.idm ? { ...todo, ...updatedTodo } : todo));
      setTodos(updatedTodos);
      toast.success('Task updated successfully');
      return;
    }
  
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedTodo),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      const updatedTodos = todos.map(todo => (todo.id === id ? data : todo));
      setTodos(updatedTodos);
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating todo: ', error);
    }
  };
  
  

  const deleteTodo = (id,idm) => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        const updatedTodos = todos.filter(todo => idm===null && todo.id<=200?todo.id !== id:todo.idm !==idm);
        setTodos(updatedTodos);
        toast.success('Task deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting todo: ', error);
      });
  };

  return (
    <div className='container'>
      <div className='wrapper'>
        <h1>To-Do List</h1>
        <span className='title'>
          <input 
            type="text" 
            value={newTodo} 
            onChange={(e) => setNewTodo(e.target.value)} 
            placeholder="Add a Task"
            className='add-task' 
          />
          <button className="add-button" onClick={addTodo}>Add Todo</button>
        </span>
        <ul className='tasklist'>
          {todos.map(todo => (
            <li key={todo.id} className={`task ${todo.completed ? 'completed' : ''}`}>
              <span>
                <span
                  className={`custom-icon circle-icon${todo.completed ? '-check' : ''}`}
                  onClick={() => updateTodo(todo.id, { ...todo, completed: !todo.completed })}
                ></span>
                <span className="text" 
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? 'grey' : 'black',
                  }}
                >
                  {todo.title}
                </span>
              </span>
              <span className="trash-icon" onClick={() => deleteTodo(todo.id,todo.id>200?todo.idm:null)}>&#x1F5D1;</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
