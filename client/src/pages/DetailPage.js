import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {Loader} from '../components/Loader'
import {TodoCard} from '../components/TodoCard'

export const DetailPage = () => {
  const {token} = useContext(AuthContext)
  const {request, loading} = useHttp()
  const [todo, setTodo] = useState(null)
  const todoId = useParams().id

  const getTodo = useCallback(async () => {
    try {
      const fetched = await request(`/api/todos/${todoId}`, 'GET', null, {
        Authorization: `Bearer ${token}`
      })
      setTodo(fetched)
    } catch (e) {}
  }, [token, todoId, request])

  useEffect(() => {
    getTodo()
  }, [getTodo])

  if (loading) {
    return <Loader />
  }

  return (
    <>
      { !loading && todo && <TodoCard todo={todo} /> }
    </>
  )
}