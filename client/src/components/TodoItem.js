import React from 'react'
import {Link} from 'react-router-dom'

export const TodoItem = ({todo, index, deleteHandler, completedChange})  => {

    function stylesWithBg() {
      let styles = {
        li: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '.5rem 1rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          marginBottom: '.5rem',
          backgroundColor: ''
        }
      }
      let bgColor = '#ffcccc'
      if(todo.completed) {
        bgColor = '#00ffcc'
      }
      styles.li.backgroundColor = bgColor
      return styles.li
    }
      
        return (
            <li style={stylesWithBg()}>
              <p>
                <label>
                  <input type="checkbox" checked={todo.completed ? true : false} onChange={() => completedChange(todo._id)}/>
                  <span><Link to={`/detail/${todo._id}`}>{todo.name}</Link></span>
                </label>
              </p>
                &nbsp;
              <button className="waves-effect waves-light btn-small" 
                onClick={() => deleteHandler(todo._id)}>Удалить</button>
            </li>
          )
}