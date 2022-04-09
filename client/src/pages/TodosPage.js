import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Loader } from '../components/Loader'
import { AuthContext } from '../context/AuthContext'
import {useHttp} from '../hooks/http.hook'
import {TodoItem} from '../components/TodoItem'
import { useMessage } from '../hooks/message.hook'

export const TodosPage = () => {
    const [todos, setTodos] = useState([])
    const {loading, request} = useHttp()
    const {token} = useContext(AuthContext)
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = React.useState([]);
    const message = useMessage()
    
    useEffect(() => {
        const fetched = async ()=> {
            try {
                const res = await request('/api/todos', 'GET', null, {
                    Authorization: `Bearer ${token}`
                })
                setTodos(res)
                setSearchResults(res)
            } catch(e) { }
        };
        fetched()
    }, [])

    useEffect(() => {
        const results = searchResults.filter(res =>
          res.name.toLowerCase().includes(searchTerm)
        );
        setTodos(results)
      }, [searchTerm]);

    async function checkboxHandler(id){
        try {
            const data = await request('api/todos/completed', 'POST', {id: id}, {
                Authorization: `Bearer ${token}`
            })
            setTodos(
                todos.map(todo => {
                  if (todo._id === id) {
                    todo.completed = !todo.completed
                  }
                  return todo
                })
              )
            message(data.message)
        } catch (e) {
            
        }
    }

    async function deleteTodo(id){
        try {
            const data = await request('/api/todos/delete', 'POST', {id: id}, {
                Authorization: `Bearer ${token}`
          })
          setTodos(
              todos.filter(todo => 
                  todo._id !== id
              )
          )
            message(data.message)
        } catch(e) {}
        }
    
       

    const styles = {
        ul: {
            listStyle: 'none',
            margin: 0,
            padding: 0
        }
    }
    


    if(loading) {
        return <Loader />
    }

    

    const handleChange = event => {
        setSearchTerm(event.target.value);
      };

    function clearSearchInput() {
        setSearchTerm("")
    }

    if(!todos.length) {
        return (
            <div className="wrapper">
            <div class="nav-wrapper">
                <form>
                    <div class="input-field">
                    <input id="search" type="search" 
                    placeholder="Search" value={searchTerm} onChange={handleChange}
                     required />
                    <label class="label-icon" for="search"><i class="material-icons">search</i></label>
                    <i class="material-icons" onClick={clearSearchInput}>clear</i>
                    </div>
                </form>
            </div>
            <p className="center">Задач на данный момент нет!</p>
            </div>
        )
    }   

    return (
        <div className="wrapper">
                <div className="nav-wrapper">
                    <form>
                        <div className="input-field" >
                            <input id="search" type="search"
                            placeholder="Search" value={searchTerm} onChange={handleChange}
                            required />
                            <label className="label-icon" for="search"><i class="material-icons">search</i></label>
                            <i className="material-icons" onClick={clearSearchInput}>clear</i>
                            <i class="material-icons">add</i>
                        </div>
                    </form>
                </div>
            
            
            
            <ul style={styles}>
                {todos.map((todo, index)=> { 
                    return(
                        <TodoItem todo={todo} key={todo._id} index={index} deleteHandler={deleteTodo} completedChange={checkboxHandler} />
                    )})}
            </ul>
        </div>
        
    )
}