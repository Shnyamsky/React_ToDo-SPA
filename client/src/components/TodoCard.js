import React, {useContext, useEffect, useState} from 'react'
import { AuthContext } from '../context/AuthContext'
import {useHttp} from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

export const TodoCard = ({ todo }) => {
    const message = useMessage()
    const {request} = useHttp()
    const auth = useContext(AuthContext)
    const [todoo, setTodoo] = useState(todo)
    const [name, setName] = useState('')
    const [des, setDes] = useState('')


    useEffect(() => {
        window.M.updateTextFields()
    }, [])
    
    const updateHandler = async event => {
            try {
                const data = await request('/api/todos/update', 'POST', {id: todo._id, 
                  name: todo.name, description: todo.description, newName: name, newDes: des}, {
                Authorization: `Bearer ${auth.token}`
              })
              setTodoo({name: name, description: des})
              message(data.message)
            } catch(e) {}
        }
    
    const nameChange = event => {
      setName(event.target.value)
    }
  
    const descriptionChange = event => {
      setDes(event.target.value)
    }
  
  return (
      <div className="col s12 m7">
        <h3>Ваша задача</h3>
        <div className="card horizontal">
          <div className="card-stacked">
            <div className="card-content">
              <h5>{todoo.name}</h5>
              <p>{todoo.description}</p>
              <p></p>
              <div className="input-field">
              <input placeholder="Имя"
                onChange={nameChange}
                id="name" type="text" 
                className="yellow-input" 
              />
              <input placeholder="Описание"
                onChange={descriptionChange}
                id="description" type="text" 
                className="yellow-input" 
              />
              <button className="waves-effect waves-light btn-small" onClick={updateHandler}>Изменить</button>
              </div>
              
        </div>
      </div>
    </div>
  </div>
  )
}