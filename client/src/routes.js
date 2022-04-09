import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {TodosPage} from './pages/TodosPage'
import {CreatePage} from './pages/CreatePage'
import {AuthPage} from './pages/AuthPage'
import {DetailPage} from './pages/DetailPage'

export const useRoutes = (isAuthenticated)  => {
    if(isAuthenticated) {
        return (
            <Switch>
                <Route path="/todos" exact>
                    <TodosPage />
                </Route>
                <Route path="/create" exact>
                    <CreatePage />
                </Route>
                <Route path="/detail/:id">
                    <DetailPage />
                </Route>
                <Redirect to="/todos" />
            </Switch>
        )
    }
    else {
        return(
            <Switch>
                <Route path="/" exact>
                    <AuthPage />
                </Route>
                <Redirect to="/" />
            </Switch>
        )
    }
    
}