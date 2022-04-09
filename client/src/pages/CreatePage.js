import React, {useContext, useEffect, useState} from 'react'
import { AuthContext } from '../context/AuthContext'
import { Loader } from '../components/Loader'
import {useHttp} from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

export const CreatePage = () => {
    const {loading, request} = useHttp()
    const message = useMessage()
    const auth = useContext(AuthContext)
    const [name, setName] = useState('')
    const [des, setDes] = useState('')

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    if(loading) {
        return <Loader />
    }
    
    const createHandler = async event => {
            try {
                const data = await request('/api/todos/create', 'POST', {name: name, description: des}, {
                Authorization: `Bearer ${auth.token}`
              })
                message(data.message)
            } catch(e) {}
    }

    return (
        <div className ="row">
             <div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>
                <h3>Создать задачу</h3>
                <div className="input-field">
                    <input placeholder="Имя"
                        onChange={e => setName(e.target.value)}
                        id="name" type="text" 
                        className="yellow-input" 
                    />
                    <input placeholder="Описание"
                        onChange={e => {setDes(e.target.value)}}
                        id="description" type="text" 
                        className="yellow-input" 
                    />
                    <button className="waves-effect waves-light btn-small" onClick={createHandler}>Создать</button>
                </div>
             </div>
            
        </div>
    )
}