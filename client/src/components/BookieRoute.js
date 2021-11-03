import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function BookieRoute({component: Component, ...rest}) {
    const { currentUser } = useAuth();
    
    return (
        <Route
            {...rest}
            render={props => {
                return (currentUser && currentUser.displayName === "bookie") ? <Component {...props} /> : <Redirect to='/login' />
            }}
        ></Route>
    )
}
